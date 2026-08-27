package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * CORS 配置:只放行前端开发地址 http://localhost:5173(决策 A,精确放行)
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        // 精确来源(不用 *:带凭证的请求不允许全放行)
        config.addAllowedOrigin("http://localhost:5173");
        // 方法:GET/POST/PUT/DELETE 全开(还有 OPTIONS 预检自动处理)
        config.addAllowedMethod("*");
        // 请求头全开:将来前端要带 Authorization 头(JWT)
        config.addAllowedHeader("*");
        // 允许携带凭证(cookie/Authorization)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // 对所有路径生效
        return new CorsFilter(source);
    }
}
