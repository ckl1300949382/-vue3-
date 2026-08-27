package com.example.backend.controller;

import com.example.backend.common.Result;
import com.example.backend.dto.ChangePasswordRequest;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.UpdateRequest;
import com.example.backend.service.UserService;
import com.example.backend.vo.LoginVO;
import com.example.backend.vo.UserVO;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 用户接口:前台只负责收请求、调经理、端菜上桌,不碰业务逻辑
 */
@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /** 登录:POST /api/login,body {username, password} */
    @PostMapping("/login")
    public Result<LoginVO> login(@RequestBody LoginRequest req) {
        return Result.ok(userService.login(req.getUsername(), req.getPassword()));
    }

    /** 注册:POST /api/register,body {username, password, email, name} */
    @PostMapping("/register")
    public Result<UserVO> register(@RequestBody RegisterRequest req) {
        return Result.ok(userService.register(req.getUsername(), req.getPassword(), req.getEmail(), req.getName()));
    }

    /** 添加用户:POST /api/users(管理员用;权限在 service 的 createUserAsAdmin 里校验) */
    @PostMapping("/users")
    public Result<UserVO> addUser(@RequestBody RegisterRequest req) {
        return Result.ok(userService.createUserAsAdmin(req.getUsername(), req.getPassword(), req.getEmail(), req.getName()));
    }

    /** 查单个用户:GET /api/users/{id} */
    @GetMapping("/users/{id}")
    public Result<UserVO> getUser(@PathVariable Long id) {
        return Result.ok(userService.getUserById(id));
    }

    /** 用户列表:GET /api/users?keyword=&page=1&pageSize=10 */
    @GetMapping("/users")
    public Result<Map<String, Object>> list(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        return Result.ok(userService.listUsers(keyword, page, pageSize));
    }

    /** 首页统计:GET /api/stats */
    @GetMapping("/stats")
    public Result<Map<String, Object>> stats() {
        return Result.ok(userService.getStats());
    }

    /** 更新用户:PUT /api/users/{id}(部分更新,只改传了的字段;权限留阶段7) */
    @PutMapping("/users/{id}")
    public Result<UserVO> update(@PathVariable Long id, @RequestBody UpdateRequest req) {
        return Result.ok(userService.updateUser(id, req));
    }

    /** 删除用户:DELETE /api/users/{id}(权限留阶段7) */
    @DeleteMapping("/users/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return Result.ok(null);
    }

    /** 修改密码:POST /api/users/{id}/change-password(阶段6 不校验"只能改自己",留阶段7) */
    @PostMapping("/users/{id}/change-password")
    public Result<Void> changePassword(@PathVariable Long id, @RequestBody ChangePasswordRequest req) {
        userService.changePassword(id, req.getOldPassword(), req.getNewPassword());
        return Result.ok(null);
    }
}
