package klu.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import klu.model.Users;
import klu.repository.UsersRepository;

@Component
public class AdminSeeder implements CommandLineRunner {

    @Autowired
    private UsersRepository userRepository;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("ktejaswanth05@gmail.com")) {
            Users admin = new Users();
            admin.setFullname("Admin");
            admin.setEmail("ktejaswanth05@gmail.com");
            admin.setPassword("admin123"); // In real apps, hash this password
            admin.setRole(1); // Assuming 1 means admin

            userRepository.save(admin);
            System.out.println("Admin user created.");
        } else {
            System.out.println("Admin user already exists.");
        }
    }
}
