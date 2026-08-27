package com.example.backend.service;

import com.example.backend.common.BizException;
import com.example.backend.dto.UpdateRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.util.JwtUtil;
import com.example.backend.util.UserContext;
import com.example.backend.vo.LoginVO;
import com.example.backend.vo.UserVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 用户业务:登录/注册等业务规则的所在地(经理层,Controller 不直接碰仓库)
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * 登录:查用户 → 验密码 → 验状态 → 发 token
     * 决策 A:用户名不存在和密码错误统一提示,不给攻击者探路
     */
    public LoginVO login(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new BizException(401, "用户名或密码错误");
        }
        if (user.getStatus() != 1) {
            throw new BizException(403, "账号已被禁用");
        }
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        return new LoginVO(token, UserVO.from(user));
    }

    /**
     * 注册:用户名查重 → 密码加密 → 保存
     * 数据库唯一约束是第二道防线,这里的查重是为了给人友好的提示
     */
    public UserVO register(String username, String password, String email, String name) {
        if (userRepository.findByUsername(username) != null) {
            throw new BizException(400, "用户名已存在");
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password)); // bcrypt 加密后入库
        user.setEmail(email);
        user.setName(name);
        user.setRole("user");          // 注册默认普通用户
        user.setStatus(1);             // 默认启用
        user.setCreatedAt(LocalDateTime.now());
        return UserVO.from(userRepository.save(user));
    }

    /**
     * 管理员添加用户:先验管理员权限,再复用 register 的创建逻辑
     * 不能在 register 里加权限检查 —— register 也被公开的 /api/register 用,加了会破坏公开注册
     */
    public UserVO createUserAsAdmin(String username, String password, String email, String name) {
        requireAdmin();
        return register(username, password, email, name);
    }

    /**
     * 查单个用户:id 不存在直接抛 404,由 GlobalExceptionHandler 翻译给前端
     * 复用 JpaRepository 自带的 findById(返回 Optional),用 orElseThrow 兜底
     */
    public UserVO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BizException(404, "用户不存在"));
        return UserVO.from(user);
    }

    /**
     * 用户列表(分页 + keyword 搜索)
     * 契约:page 从 1 开始;JPA Pageable 从 0 开始 → 查询用 page-1 转换
     * 回传 page/pageSize 用前端原值(从 1),不回传 JPA 内部 0 基页码
     * keyword 空时查全部,非空时在 username/name/email 三字段模糊匹配
     */
    public Map<String, Object> listUsers(String keyword, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);
        Page<User> userPage;
        if (keyword == null || keyword.isBlank()) {
            userPage = userRepository.findAll(pageable);
        } else {
            String kw = keyword.trim();
            userPage = userRepository.findByUsernameContainingOrNameContainingOrEmailContaining(kw, kw, kw, pageable);
        }
        List<UserVO> list = userPage.getContent().stream().map(UserVO::from).toList();
        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("total", userPage.getTotalElements());
        result.put("page", page);
        result.put("pageSize", pageSize);
        return result;
    }

    /**
     * 首页统计:总数 / 活跃数 / 管理员数 / 当前年份
     * total 用继承的 count();active/admin 用自定义 countByStatus/countByRole
     */
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", userRepository.count());
        stats.put("active", userRepository.countByStatus(1));
        stats.put("admin", userRepository.countByRole("admin"));
        stats.put("year", LocalDateTime.now().getYear());
        return stats;
    }

    /**
     * 更新用户(部分更新):只改 req 里非 null 的字段,没传的不动
     * 必须先查出原对象再改再 save —— 不能直接 new User 覆盖,否则没传的字段会被置 null
     */
    public UserVO updateUser(Long id, UpdateRequest req) {
        requireAdmin();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BizException(404, "用户不存在"));
        if (req.getName() != null) user.setName(req.getName());
        if (req.getEmail() != null) user.setEmail(req.getEmail());
        if (req.getRole() != null) user.setRole(req.getRole());
        if (req.getStatus() != null) user.setStatus(req.getStatus());
        return UserVO.from(userRepository.save(user));
    }

    /**
     * 删除用户:先查再删,保证 id 不存在时返回 404
     * 不能直接 deleteById(id) —— id 不存在时 JPA 会抛异常变 500
     */
    public void deleteUser(Long id) {
        requireAdmin();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BizException(404, "用户不存在"));
        userRepository.delete(user);
    }

    /**
     * 修改密码:验旧密码 → 校验新密码长度 → 加密存储
     * 旧密码用 matches 比对(bcrypt 单向,不能解密);新密码用 encode 加密后存
     * 阶段6 不校验"只能改自己",留阶段7
     */
    public void changePassword(Long id, String oldPassword, String newPassword) {
        requireSelf(id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BizException(404, "用户不存在"));
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BizException(400, "原密码错误");
        }
        if (newPassword == null || newPassword.length() < 6) {
            throw new BizException(400, "新密码长度不能少于6位");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /** 要求当前登录用户是管理员,否则 403(阶段7:后端真正鉴权) */
    private void requireAdmin() {
        Long currentId = UserContext.getUserId();
        if (currentId == null) {
            throw new BizException(401, "未登录");
        }
        User current = userRepository.findById(currentId)
                .orElseThrow(() -> new BizException(401, "登录用户不存在"));
        if (!"admin".equals(current.getRole())) {
            throw new BizException(403, "需要管理员权限");
        }
    }

    /** 要求目标 id 就是当前登录用户(改密码只能改自己),否则 403 */
    private void requireSelf(Long targetId) {
        Long currentId = UserContext.getUserId();
        if (currentId == null || !currentId.equals(targetId)) {
            throw new BizException(403, "只能修改自己的密码");
        }
    }
}
