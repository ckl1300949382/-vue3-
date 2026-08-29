package com.example.backend.vo;

/**
 * 状态分布单点:name 直接是中文标签(启用/禁用),value 是该状态人数
 * 中文在 SQL 的 CASE 里翻译好,前端零映射直接渲染
 * 前端契约(StatusItem):{ "name": "启用", "value": 12 }
 */
public class StatusDistributionVO {

    private String name;
    private long value;

    public StatusDistributionVO(String name, long value) {
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
