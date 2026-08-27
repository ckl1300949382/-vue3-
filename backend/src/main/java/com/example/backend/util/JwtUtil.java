package com.example.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT 工具:发卡(生成 token)和验卡(解析 token)
 */
@Component
public class JwtUtil {

    /** 签名密钥:真实项目放配置文件/环境变量,这里写死便于教学 */
    private static final String SECRET = "user-management-jwt-secret-key-2026-change-me-in-production";
    private static final long EXPIRE_MILLIS = 60 * 60 * 1000L; // 1 小时(决策 A)

    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    /** 生成 token:把 userId 和 username 写进卡片 Payload */
    public String generateToken(Long userId, String username) {
        Date now = new Date();
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("username", username)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + EXPIRE_MILLIS))
                .signWith(key)
                .compact();
    }

    /**
     * 解析 token:验签 + 取 Payload
     * token 无效/过期/被篡改都会抛异常,由调用方决定怎么处理
     */
    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
