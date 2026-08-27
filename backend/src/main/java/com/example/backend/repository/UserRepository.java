package com.example.backend.repository;

import com.example.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

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
}
