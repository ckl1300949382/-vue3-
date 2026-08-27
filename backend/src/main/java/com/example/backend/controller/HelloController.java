package com.example.backend.controller;

import com.example.backend.common.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HelloController {

    @GetMapping("/hello")
    public Result<Map<String, String>> hello() {
        return Result.ok(Map.of("message", "Hello from Spring Boot!", "port", "3001"));
    }
}
