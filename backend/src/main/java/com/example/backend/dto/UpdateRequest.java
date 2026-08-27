package com.example.backend.dto;

/**
 * 更新用户请求体:所有字段可选(部分更新,只改传了的字段)
 * 故意不含 password:密码走专门的 /api/users/{id}/change-password 接口(6.4)
 */
public class UpdateRequest {

    private String name;
    private String email;
    private String role;      // "admin" 或 "user"
    private Integer status;   // 1=正常, 0=禁用(注意 0 是有效值,判空用 !=null 不用 !=0)

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
}
