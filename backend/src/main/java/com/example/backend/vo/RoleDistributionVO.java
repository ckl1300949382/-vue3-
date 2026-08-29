package com.example.backend.vo;

/**
 * 角色分布单点:name 与 users.role 字段一致(仅 admin/user),value 是该角色人数
 * 前端契约(RoleItem):{ "name": "admin", "value": 1 }
 */
public class RoleDistributionVO {

    private String name;
    private long value;

    public RoleDistributionVO(String name, long value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public long getValue() {
        return value;
    }
}
