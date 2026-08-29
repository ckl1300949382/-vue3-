package com.example.backend.repository;

import com.example.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 用户仓库:只写方法名,SQL 由 Spring Data JPA 自动生成
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /** 按用户名精确查询(阶段 4 登录用) */
    User findByUsername(String username);

    /**
     * 分页 + keyword 模糊搜索:username / name / email 三字段任一命中即可
     * 方法名按 JPA 派生规则写,SQL 自动生成(WHERE username LIKE '%kw%' OR name LIKE '%kw%' OR email LIKE '%kw%')
     */
    Page<User> findByUsernameContainingOrNameContainingOrEmailContaining(
            String username, String name, String email, Pageable pageable);

    /** status == 指定值的用户数(1=正常,0=禁用) */
    long countByStatus(Integer status);

    /** role == 指定值的用户数(role='admin' 等) */
    long countByRole(String role);

    /**
     * 近 N 天每日注册数:按 created_at 的日期分组计数,只统计 start 之后的
     * 用原生 SQL,因为 DATE_FORMAT 是 MySQL 专有函数;返回 [date, count] 每行两个值
     * 注意:GROUP BY 只返回有注册记录的日期,缺失日期的补零由 Service 层做
     */
    @Query(value = "SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS day, COUNT(*) AS cnt "
            + "FROM users WHERE created_at >= :start "
            + "GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d') ORDER BY day", nativeQuery = true)
    List<Object[]> countRegisteredByDay(@Param("start") LocalDateTime start);

    /**
     * 各角色用户数:按 role 字段分组计数(role 只有 admin/user 两种)
     * 返回 [role, count] 每行两个值
     */
    @Query("SELECT u.role AS name, COUNT(u) AS cnt FROM User u GROUP BY u.role")
    List<Object[]> countGroupByRole();

    /**
     * 各状态用户数:按 status 分组计数,SELECT 里用 CASE 把数字翻成中文标签
     * (status: 1=启用, 0=禁用)——中文标签直接在 SQL 里出,Service 只做 VO 翻译
     * 返回 [name, count] 每行两个值;ORDER BY status DESC 保证"启用"(1)排在"禁用"(0)前
     */
    @Query(value = "SELECT CASE WHEN status = 1 THEN '启用' WHEN status = 0 THEN '禁用' ELSE '未知' END AS name, "
            + "COUNT(*) AS cnt FROM users GROUP BY status ORDER BY status DESC", nativeQuery = true)
    List<Object[]> countGroupByStatus();

    /**
     * 近 N 个月每月注册数:按 created_at 的月份分组计数,只统计 start 之后的
     * 与 countRegisteredByDay 同构,只是粒度从"天"换成"月"(%Y-%m);缺失月份补零由 Service 层做
     */
    @Query(value = "SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS cnt "
            + "FROM users WHERE created_at >= :start "
            + "GROUP BY DATE_FORMAT(created_at, '%Y-%m') ORDER BY month", nativeQuery = true)
    List<Object[]> countRegisteredByMonth(@Param("start") LocalDateTime start);
}
