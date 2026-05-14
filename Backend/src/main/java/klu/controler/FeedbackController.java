package klu.controler;

import klu.model.Feedback;
import klu.model.Profile;
import klu.model.JWTManager;
import klu.repository.FeedbackRepository;
import klu.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private JWTManager jwtManager;

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitFeedback(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        Feedback feedback = new Feedback();
        feedback.setEmail(request.get("email"));
        feedback.setMessage(request.get("message"));

        if (authHeader != null && !authHeader.isEmpty()) {
            String email = jwtManager.validateToken(authHeader.replace("Bearer ", ""));
            if (!"401".equals(email)) {
                profileRepository.findByEmail(email).ifPresent(feedback::setUser);
            }
        }

        feedbackRepository.save(feedback);
        response.put("status", 200);
        response.put("message", "Feedback submitted successfully. Thank you!");
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackRepository.findAllByOrderByCreatedAtDesc());
    }
}
