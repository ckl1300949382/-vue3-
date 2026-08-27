package com.example.backend.config;

import com.example.backend.util.JwtUtil;
import com.example.backend.util.UserContext;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * 登录关卡:每个受保护请求进来,先在这里验卡
 * preHandle 返回 true = 放行;false = 拦截
 */
@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    public AuthInterceptor(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String header = request.getHeader("Authorization");
        // 卡必须是 "Bearer <token>" 格式,并且验签通过
        if (header != null && header.startsWith("Bearer ")) {
            try {
                Claims claims = jwtUtil.parseToken(header.substring(7));
                UserContext.setUserId(Long.valueOf(claims.getSubject()));
                return true; // 放行
            } catch (Exception e) {
                // token 无效/过期/被篡改,落入下面的拒绝逻辑
            }
        }
        // 拒绝:写 401 + Result 格式(前端拦截器收到 401 会登出跳转)
        response.setStatus(401);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"code\":401,\"message\":\"未登录或登录已过期\",\"data\":null}");
        return false;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        UserContext.clear(); // 请求结束必须清空,防止线程池复用把 userId 串到下一个请求
    }
}
