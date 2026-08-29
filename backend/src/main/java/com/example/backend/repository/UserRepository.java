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
}
