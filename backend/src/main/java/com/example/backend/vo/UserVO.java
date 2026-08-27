package com.example.backend.vo;

import com.example.backend.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

/**
 * 用户信息 VO(View Object):返回给前端的用户数据
 * 设计目的:实体有 password,绝不能直接返回;VO 是"给前端看的版本"
 */
public class UserVO {

    private Long id;
    private String username;
    private String email;
    private String name;
    private String role;
    private Integer status;

    /** 契约:createdAt 必须 yyyy-MM-dd HH:mm:ss,不带 T(spring.jackson.date-format 管不了 LocalDateTime,必须字段级指定) */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    public UserVO() {
    }

    /** 实体 → VO 转换:唯一入口,确保不会漏字段(尤其不会漏进 password) */
    public static UserVO from(User u) {
        UserVO vo = new UserVO();
        vo.setId(u.getId());
        vo.setUsername(u.getUsername());
        vo.setEmail(u.getEmail());
        vo.setName(u.getName());
        vo.setRole(u.getRole());
        vo.setStatus(u.getStatus());
        vo.setCreatedAt(u.getCreatedAt());
        return vo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
