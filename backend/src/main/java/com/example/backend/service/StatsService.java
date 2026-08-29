package com.example.backend.service;

import com.example.backend.common.BizException;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.util.UserContext;
import com.example.backend.vo.RegisterMonthlyVO;
import com.example.backend.vo.RegisterTrendVO;
import com.example.backend.vo.RoleDistributionVO;
import com.example.backend.vo.StatusDistributionVO;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 统计业务:聚合查询都在 SQL 里做(数据库算,不用 Java 循环数数),
 * 这里只做 SQL 算不了的两件事:补零、拼 VO
 */
@Service
public class StatsService {

    /** 默认统计天数 */
    private static final int DEFAULT_DAYS = 30;

    /** 默认统计月数(管理看板月度注册,对应前端 getRegisterMonthly 的默认 12) */
    private static final int DEFAULT_MONTHS = 12;

    private final UserRepository userRepository;

    public StatsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 近 N 天每日注册数
     * SQL 分组聚合只返回"有注册"的日期,这里生成连续 N 天的日期序列,
     * 用查出来的结果填空,没注册的日期补 0 —— 保证前端画折线图每天都有点
     */
    public List<RegisterTrendVO> getRegisterTrend(int days) {
        if (days < 1) {
            days = DEFAULT_DAYS;
        }
        // 窗口起点:今天往前推 days-1 天(含今天共 days 天),取当天零点(created_at 是 datetime 类型)
        LocalDate startDate = LocalDate.now().minusDays(days - 1L);
        List<Object[]> rows = userRepository.countRegisteredByDay(startDate.atStartOfDay());

        // 先按日期把 SQL 结果收进 Map,方便后面查表填充
        Map<String, Long> countByDay = new HashMap<>();
        for (Object[] row : rows) {
            countByDay.put((String) row[0], ((Number) row[1]).longValue());
        }

        // 从窗口起点逐天生成,查不到就补 0
        List<RegisterTrendVO> result = new ArrayList<>(days);
        for (int i = 0; i < days; i++) {
            String day = startDate.plusDays(i).toString(); // LocalDate.toString() 正好是 yyyy-MM-dd
            result.add(new RegisterTrendVO(day, countByDay.getOrDefault(day, 0L)));
        }
        return result;
    }

    /**
     * 各角色用户数:SQL 按 role 分组,直接翻译成前端契约的 name/value 结构
     * name 与 users.role 字段值一致(admin/user)
     */
    public List<RoleDistributionVO> getRoleDistribution() {
        List<Object[]> rows = userRepository.countGroupByRole();
        List<RoleDistributionVO> result = new ArrayList<>(rows.size());
        for (Object[] row : rows) {
            result.add(new RoleDistributionVO((String) row[0], ((Number) row[1]).longValue()));
        }
        return result;
    }

    /**
     * 各状态用户数:SQL 按 status 分组 + CASE 翻译中文标签(管理看板用)
     * name 直接是前端要的"启用/禁用",Service 只做 List→VO 的翻译,零映射
     */
    public List<StatusDistributionVO> getStatusDistribution() {
        requireAdmin();
        List<Object[]> rows = userRepository.countGroupByStatus();
        List<StatusDistributionVO> result = new ArrayList<>(rows.size());
        for (Object[] row : rows) {
            result.add(new StatusDistributionVO((String) row[0], ((Number) row[1]).longValue()));
        }
        return result;
    }

    /**
     * 近 N 个月每月注册数(含当月共 N 个月,管理看板用)
     * 与 getRegisterTrend 同构:SQL 分组只返回"有注册"的月份,这里生成连续月份序列补 0
     * YearMonth 是"年+月"专用类型,toString() 正好是 yyyy-MM,不用手动拼月份字符串
     */
    public List<RegisterMonthlyVO> getRegisterMonthly(int months) {
        requireAdmin();
        if (months < 1) {
            months = DEFAULT_MONTHS;
        }
        // 窗口起点:当月往前推 months-1 个月,atDay(1) 取当月 1 号零点(created_at 是 datetime 类型)
        YearMonth start = YearMonth.now().minusMonths(months - 1L);
        List<Object[]> rows = userRepository.countRegisteredByMonth(start.atDay(1).atStartOfDay());

        // 先按月份把 SQL 结果收进 Map,方便后面查表填充
        Map<String, Long> countByMonth = new HashMap<>();
        for (Object[] row : rows) {
            countByMonth.put((String) row[0], ((Number) row[1]).longValue());
        }

        // 从窗口起点逐月生成,查不到就补 0
        List<RegisterMonthlyVO> result = new ArrayList<>(months);
        for (int i = 0; i < months; i++) {
            String month = start.plusMonths(i).toString();
            result.add(new RegisterMonthlyVO(month, countByMonth.getOrDefault(month, 0L)));
        }
        return result;
    }

    /**
     * 管理看板接口的权限:要求当前登录用户是管理员,否则 403
     * 逻辑与 UserService.requireAdmin 相同 —— 那个是 private 无法复用,这里复制一份
     * (技术债:后续可抽成公共类,但按"只新增不改现有"约束,先复制)
     */
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
}
