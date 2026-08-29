package com.example.backend.controller;

import com.example.backend.common.Result;
import com.example.backend.service.StatsService;
import com.example.backend.vo.RegisterMonthlyVO;
import com.example.backend.vo.RegisterTrendVO;
import com.example.backend.vo.RoleDistributionVO;
import com.example.backend.vo.StatusDistributionVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 首页看板统计:注册趋势 + 角色分布
 * 路径都在 /api/stats 下,与 UserController 的 GET /api/stats 互不冲突(路径不同)
 * 权限:任何登录用户可见(与 GET /api/stats 一致,首页所有登录用户都要用)
 */
@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    /** 注册趋势:GET /api/stats/register-trend?days=30,返回连续 N 天 [{date, count}] */
    @GetMapping("/register-trend")
    public Result<List<RegisterTrendVO>> registerTrend(@RequestParam(defaultValue = "30") int days) {
        return Result.ok(statsService.getRegisterTrend(days));
    }

    /** 角色分布:GET /api/stats/role-distribution,返回 [{name, value}] */
    @GetMapping("/role-distribution")
    public Result<List<RoleDistributionVO>> roleDistribution() {
        return Result.ok(statsService.getRoleDistribution());
    }

    /** 状态分布:GET /api/stats/status-distribution,返回 [{name: 中文, value}](管理看板,仅 admin) */
    @GetMapping("/status-distribution")
    public Result<List<StatusDistributionVO>> statusDistribution() {
        return Result.ok(statsService.getStatusDistribution());
    }

    /** 月度注册:GET /api/stats/register-monthly?months=12,返回连续 N 个月 [{month, count}](管理看板,仅 admin) */
    @GetMapping("/register-monthly")
    public Result<List<RegisterMonthlyVO>> registerMonthly(@RequestParam(defaultValue = "12") int months) {
        return Result.ok(statsService.getRegisterMonthly(months));
    }
}
