package com.example.backend.vo;

/**
 * 月度注册单点:month 是 yyyy-MM 字符串,count 是该月注册人数
 * 前端契约(MonthlyPoint):{ "month": "2026-08", "count": 3 }
 */
public class RegisterMonthlyVO {

    private String month;
    private long count;

    public RegisterMonthlyVO(String month, long count) {
        this.month = month;
        this.count = count;
    }

    public String getMonth() {
        return month;
    }

    public long getCount() {
        return count;
    }
}
