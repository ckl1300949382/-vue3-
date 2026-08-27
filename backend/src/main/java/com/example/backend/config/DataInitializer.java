package com.example.backend.config;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * 启动时预置数据:users 表为空时插入 15 个测试用户(与旧 Node 后端保持一致)
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /** 构造器注入:Spring 启动时自动把实例传进来 */
    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 幂等:表里已有数据就跳过,防止每次重启都重复插入
        if (userRepository.count() > 0) {
            log.info("users 表已有数据,跳过预置");
            return;
        }
        userRepository.saveAll(buildUsers());
        log.info("已预置 15 个测试用户");
    }

    /**
     * 预置数据行:username, email, name, role, status, createdAt
     * status: 1=启用 0=禁用(user3/7/11 禁用,与旧后端一致)
     */
    private List<User> buildUsers() {
        String[][] rows = {
                {"admin",  "admin@example.com",  "管理员", "admin", "1", "2024-01-01 10:00:00"},
                {"user1",  "user1@example.com",  "张三",   "user",  "1", "2024-01-02 14:30:00"},
                {"user2",  "user2@example.com",  "李四",   "user",  "1", "2024-01-03 09:15:00"},
                {"user3",  "user3@example.com",  "王五",   "user",  "0", "2024-01-04 16:45:00"},
                {"user4",  "user4@example.com",  "赵六",   "user",  "1", "2024-01-05 11:20:00"},
                {"user5",  "user5@example.com",  "孙七",   "user",  "1", "2024-01-06 13:30:00"},
                {"user6",  "user6@example.com",  "周八",   "user",  "1", "2024-01-07 10:45:00"},
                {"user7",  "user7@example.com",  "吴九",   "user",  "0", "2024-01-08 15:20:00"},
                {"user8",  "user8@example.com",  "郑十",   "user",  "1", "2024-01-09 09:00:00"},
                {"user9",  "user9@example.com",  "陈十一", "user",  "1", "2024-01-10 11:30:00"},
                {"user10", "user10@example.com", "黄十二", "user",  "1", "2024-01-11 14:00:00"},
                {"user11", "user11@example.com", "林十三", "user",  "0", "2024-01-12 16:30:00"},
                {"user12", "user12@example.com", "何十四", "user",  "1", "2024-01-13 10:15:00"},
                {"user13", "user13@example.com", "马十五", "user",  "1", "2024-01-14 13:45:00"},
                {"user14", "user14@example.com", "钱十六", "user",  "1", "2024-01-15 10:00:00"},
        };

        List<User> users = new ArrayList<>();
        for (String[] r : rows) {
            User u = new User();
            u.setUsername(r[0]);
            u.setEmail(r[1]);
            u.setName(r[2]);
            u.setRole(r[3]);
            u.setStatus(Integer.valueOf(r[4]));
            u.setCreatedAt(LocalDateTime.parse(r[5], FMT));
            u.setPassword(passwordEncoder.encode("123456")); // bcrypt 加密后入库(阶段 4 升级完成)
            users.add(u);
        }
        return users;
    }
}
