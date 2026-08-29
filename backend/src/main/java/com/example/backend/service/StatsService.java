package com.example.backend.service;

import com.example.backend.repository.UserRepository;
import com.example.backend.vo.RegisterTrendVO;
import com.example.backend.vo.RoleDistributionVO;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 统计业务:聚合查询都在 SQL 里做(数据库算,不用 Java 循环数数),
 * 这里只做 SQL 算不了的两件事:补零、拼 VO
 */
@Service
public class StatsService {

    /** 默认统计天数 */
    private static final int DEFAULT_DAYS = 30;

    private final UserRepository userRepository;

    public StatsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 近 N 天每日注册数
     * SQL 分组聚合只返回"有注册"的日期,这里生成连续 N 天的日期序列,
     * 用查出来的结果填空,没注册的日期补 0 —— 保证前端画折线图每天都有点
     */
    public List<RegisterTrendVO> getRegisterTrend(int days) {
        if (days < 1) {
            days = DEFAULT_DAYS;
        }
        // 窗口起点:今天往前推 days-1 天(含今天共 days 天),取当天零点(created_at 是 datetime 类型)
        LocalDate startDate = LocalDate.now().minusDays(days - 1L);
        List<Object[]> rows = userRepository.countRegisteredByDay(startDate.atStartOfDay());

        // 先按日期把 SQL 结果收进 Map,方便后面查表填充
        Map<String, Long> countByDay = new HashMap<>();
        for (Object[] row : rows) {
            countByDay.put((String) row[0], ((Number) row[1]).longValue());
        }

        // 从窗口起点逐天生成,查不到就补 0
        List<RegisterTrendVO> result = new ArrayList<>(days);
        for (int i = 0; i < days; i++) {
            String day = startDate.plusDays(i).toString(); // LocalDate.toString() 正好是 yyyy-MM-dd
            result.add(new RegisterTrendVO(day, countByDay.getOrDefault(day, 0L)));
        }
        return result;
    }

    /**
     * 各角色用户数:SQL 按 role 分组,直接翻译成前端契约的 name/value 结构
     * name 与 users.role 字段值一致(admin/user)
     */
    public List<RoleDistributionVO> getRoleDistribution() {
        List<Object[]> rows = userRepository.countGroupByRole();
        List<RoleDistributionVO> result = new ArrayList<>(rows.size());
        for (Object[] row : rows) {
            result.add(new RoleDistributionVO((String) row[0], ((Number) row[1]).longValue()));
        }
        return result;
    }
}
