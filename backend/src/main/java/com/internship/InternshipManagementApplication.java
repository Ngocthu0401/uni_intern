package com.internship;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class InternshipManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(InternshipManagementApplication.class, args);
    }

} 