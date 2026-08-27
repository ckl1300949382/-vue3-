package com.example.backend.common;

/**
 * 业务异常:业务规则不满足时(密码错误、用户名已存在……)直接 throw 它
 * code 会作为 HTTP 状态码返回给前端
 */
public class BizException extends RuntimeException {

    private final Integer code;

    public BizException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public Integer getCode() {
        return code;
    }
}
