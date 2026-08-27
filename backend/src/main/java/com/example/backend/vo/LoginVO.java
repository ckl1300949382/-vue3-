package com.example.backend.vo;

/**
 * 登录成功响应:{token, user} —— 与前端 Login.vue 的
 * userStore.login(res.data.token, res.data.user) 严格对应
 */
public class LoginVO {

    private String token;
    private UserVO user;

    public LoginVO(String token, UserVO user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserVO getUser() {
        return user;
    }

    public void setUser(UserVO user) {
        this.user = user;
    }
}
