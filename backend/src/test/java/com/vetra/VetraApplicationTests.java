package com.vetra;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("local")
class VetraApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring context loads cleanly with all domain modules
    }
}
