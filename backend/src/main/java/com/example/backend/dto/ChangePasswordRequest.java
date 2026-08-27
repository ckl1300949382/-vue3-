package com.example.backend.dto;

/**
 * 修改密码请求体:旧密码 + 新密码
 * 旧密码用于验证身份(matches 比对,bcrypt 单向不能解密)
 * 新密码需 >= 6 位(业务规则)
 */
public class ChangePasswordRequest {

    private String oldPassword;
    private String newPassword;

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
