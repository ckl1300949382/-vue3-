package com.example.backend.util;

/**
 * 当前登录用户上下文:拦截器验卡通过后,把 userId 存进 ThreadLocal
 * 后续 Controller/Service 通过 getUserId() 知道"我是谁"(阶段 5 权限判断要用)
 */
public class UserContext {

    /** ThreadLocal:每个请求线程独享一个"储物柜",互不串号 */
    private static final ThreadLocal<Long> USER_ID = new ThreadLocal<>();

    public static void setUserId(Long userId) {
        USER_ID.set(userId);
    }

    public static Long getUserId() {
        return USER_ID.get();
    }

    public static void clear() {
        USER_ID.remove();
    }
}
