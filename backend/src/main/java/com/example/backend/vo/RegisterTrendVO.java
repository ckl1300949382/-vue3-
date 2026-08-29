package com.example.backend.vo;

/**
 * 注册趋势单点:date 是 yyyy-MM-dd 字符串,count 是该日注册人数
 * 前端契约(TrendPoint):{ "date": "2026-08-01", "count": 3 }
 */
public class RegisterTrendVO {

    private String date;
    private long count;

    public RegisterTrendVO(String date, long count) {
        this.date = date;
        this.count = count;
    }

    public String getDate() {
        return date;
    }

    public long getCount() {
        return count;
    }
}
