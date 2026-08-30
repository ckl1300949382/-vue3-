package com.example.backend.config;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 启动时预置数据:users 表为空时插入 15 个测试用户(与旧 Node 后端保持一致)
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

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
     * 预置数据行:username, email, name, role, status
     * status: 1=启用 0=禁用(user3/7/11 禁用,与旧后端一致)
     * createdAt 不再写死,由 dateAt(i) 动态生成(见下方分布说明)
     */
    private List<User> buildUsers() {
        String[][] rows = {
                {"admin",  "admin@example.com",  "管理员", "admin", "1"},
                {"user1",  "user1@example.com",  "张三",   "user",  "1"},
                {"user2",  "user2@example.com",  "李四",   "user",  "1"},
                {"user3",  "user3@example.com",  "王五",   "user",  "0"},
                {"user4",  "user4@example.com",  "赵六",   "user",  "1"},
                {"user5",  "user5@example.com",  "孙七",   "user",  "1"},
                {"user6",  "user6@example.com",  "周八",   "user",  "1"},
                {"user7",  "user7@example.com",  "吴九",   "user",  "0"},
                {"user8",  "user8@example.com",  "郑十",   "user",  "1"},
                {"user9",  "user9@example.com",  "陈十一", "user",  "1"},
                {"user10", "user10@example.com", "黄十二", "user",  "1"},
                {"user11", "user11@example.com", "林十三", "user",  "0"},
                {"user12", "user12@example.com", "何十四", "user",  "1"},
                {"user13", "user13@example.com", "马十五", "user",  "1"},
                {"user14", "user14@example.com", "钱十六", "user",  "1"},
        };

        List<User> users = new ArrayList<>();
        for (int i = 0; i < rows.length; i++) {
            String[] r = rows[i];
            User u = new User();
            u.setUsername(r[0]);
            u.setEmail(r[1]);
            u.setName(r[2]);
            u.setRole(r[3]);
            u.setStatus(Integer.valueOf(r[4]));
            u.setCreatedAt(dateAt(i));
            u.setPassword(passwordEncoder.encode("123456")); // bcrypt 加密后入库(阶段 4 升级完成)
            users.add(u);
        }
        return users;
    }

    /**
     * 动态注册日期:以当前时间为基准往前推(写死日期几个月后就过期,看板会再次全 0)
     * 分布设计(混合,让两个统计看板都有内容):
     *   前 10 人:最近 30 天,约每 3 天一个 → register-trend?days=30 有起伏
     *   后 5 人 :近 12 个月(9月/11月/2月/5月/7月,每月 15 号)→ register-monthly?months=12 多月有柱
     */
    private LocalDateTime dateAt(int index) {
        LocalDateTime now = LocalDateTime.now();
        if (index < 10) {
            // 最近 30 天:index 0→29天前,index 9→2天前
            return now.minusDays(29L - index * 3).withHour(10).withMinute(0).withSecond(0);
        }
        // 近 12 个月:月份偏移与 users 后 5 人一一对应;withDayOfMonth(15) 避开月末边界
        long[] monthOffsets = {11, 9, 6, 3, 1};
        return now.minusMonths(monthOffsets[index - 10]).withDayOfMonth(15).withHour(10).withMinute(0).withSecond(0);
    }
}
