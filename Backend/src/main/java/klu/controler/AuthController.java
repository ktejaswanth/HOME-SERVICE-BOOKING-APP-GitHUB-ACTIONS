package klu.controler;

import klu.model.Profile;
import klu.model.Provider;
import klu.model.JWTManager;
import klu.model.EmailManager;
import klu.repository.ProfileRepository;
import klu.repository.ProviderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private JWTManager jwtManager;

    @Autowired
    private EmailManager emailManager;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signUp(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String fullName = request.get("fullName");
        String email = request.get("email");
        String password = request.get("password");
        String role = request.getOrDefault("role", "customer");
        String phone = request.get("phone");
        String city = request.get("city");

        if (fullName == null || email == null || password == null) {
            response.put("status", 400);
            response.put("message", "Full name, email, and password are required");
            return ResponseEntity.badRequest().body(response);
        }

        if (profileRepository.existsByEmail(email)) {
            response.put("status", 409);
            response.put("message", "Email already registered");
            return ResponseEntity.status(409).body(response);
        }

        Profile profile = new Profile();
        profile.setFullName(fullName);
        profile.setEmail(email);
        profile.setPasswordHash(password);
        profile.setRole(role);
        profile.setPhone(phone);
        profile.setCity(city);
        profile.setIsActive(true);

        Profile saved = profileRepository.save(profile);

        // If registering as provider, create provider record
        if ("provider".equals(role)) {
            Provider provider = new Provider();
            provider.setProfile(saved);
            provider.setVerificationStatus("pending");
            provider.setIsVerified(false);
            provider.setIsAvailable(false);
            providerRepository.save(provider);
        }

        String token = jwtManager.generateToken(email);

        response.put("status", 200);
        response.put("message", "Registration successful");
        response.put("token", token);
        response.put("user", buildUserResponse(saved));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, Object>> signIn(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String email = request.get("email");
        String password = request.get("password");

        Optional<Profile> profileOpt = profileRepository.findByEmail(email);

        if (profileOpt.isEmpty() || !profileOpt.get().getPasswordHash().equals(password)) {
            response.put("status", 401);
            response.put("message", "Invalid email or password");
            return ResponseEntity.status(401).body(response);
        }

        Profile profile = profileOpt.get();

        if (!profile.getIsActive()) {
            response.put("status", 403);
            response.put("message", "Account is deactivated. Contact support.");
            return ResponseEntity.status(403).body(response);
        }

        String token = jwtManager.generateToken(email);

        response.put("status", 200);
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("user", buildUserResponse(profile));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        String email = request.get("email");

        Optional<Profile> profileOpt = profileRepository.findByEmail(email);

        if (profileOpt.isEmpty()) {
            response.put("status", 404);
            response.put("message", "Email not found");
            return ResponseEntity.status(404).body(response);
        }

        Profile profile = profileOpt.get();
        String message = String.format("Dear %s,\n\nYour password is: %s\n\nPlease change it after login.\n\n— HomeServe Team",
                profile.getFullName(), profile.getPasswordHash());
        emailManager.sendEmail(profile.getEmail(), "HomeServe: Password Recovery", message);

        response.put("status", 200);
        response.put("message", "Password recovery email sent successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> response = new HashMap<>();

        String token = authHeader.replace("Bearer ", "");
        String email = jwtManager.validateToken(token);

        if ("401".equals(email)) {
            response.put("status", 401);
            response.put("message", "Token expired or invalid");
            return ResponseEntity.status(401).body(response);
        }

        Optional<Profile> profileOpt = profileRepository.findByEmail(email);
        if (profileOpt.isEmpty()) {
            response.put("status", 404);
            response.put("message", "User not found");
            return ResponseEntity.status(404).body(response);
        }

        response.put("status", 200);
        response.put("user", buildUserResponse(profileOpt.get()));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String token = authHeader.replace("Bearer ", "");
        String email = jwtManager.validateToken(token);

        if ("401".equals(email)) {
            response.put("status", 401);
            response.put("message", "Token expired");
            return ResponseEntity.status(401).body(response);
        }

        Optional<Profile> profileOpt = profileRepository.findByEmail(email);
        if (profileOpt.isEmpty()) {
            response.put("status", 404);
            response.put("message", "User not found");
            return ResponseEntity.status(404).body(response);
        }

        Profile profile = profileOpt.get();
        if (request.containsKey("fullName")) profile.setFullName(request.get("fullName"));
        if (request.containsKey("phone")) profile.setPhone(request.get("phone"));
        if (request.containsKey("city")) profile.setCity(request.get("city"));
        if (request.containsKey("address")) profile.setAddress(request.get("address"));

        profileRepository.save(profile);

        response.put("status", 200);
        response.put("message", "Profile updated successfully");
        response.put("user", buildUserResponse(profile));
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> buildUserResponse(Profile profile) {
        Map<String, Object> user = new HashMap<>();
        user.put("id", profile.getId());
        user.put("fullName", profile.getFullName());
        user.put("email", profile.getEmail());
        user.put("role", profile.getRole());
        user.put("phone", profile.getPhone());
        user.put("city", profile.getCity());
        user.put("isPremium", profile.getIsPremium());
        user.put("avatarUrl", profile.getAvatarUrl());
        user.put("createdAt", profile.getCreatedAt());
        return user;
    }
}
