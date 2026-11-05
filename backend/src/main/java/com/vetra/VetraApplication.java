package com.vetra;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
public class VetraApplication {
    public static void main(String[] args) {
        SpringApplication.run(VetraApplication.class, args);
    }
}
