package com.orchids.main;

import com.orchids.pojo.Role;
import com.orchids.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {
        "com.orchids.controller",
        "com.orchids.service",
        "com.orchids.repository",
        "com.orchids.config",
        "com.orchids.security"
})
@EnableMongoRepositories(basePackages = "com.orchids.repository")
public class OrchidServiceApplication implements CommandLineRunner {
    @Autowired
    private RoleService roleService;

    public static void main(String[] args) {
        SpringApplication.run(OrchidServiceApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Startup logic can be added here if needed
        int roleCount = roleService.getAllRoles().size();
        if (roleCount == 0) {
            Role role = new Role();
            role.setRoleName("Admin");
            Role role2 = new Role();
            role2.setRoleName("User");
            roleService.insertRole(role);
            roleService.insertRole(role2);
        }
    }
}