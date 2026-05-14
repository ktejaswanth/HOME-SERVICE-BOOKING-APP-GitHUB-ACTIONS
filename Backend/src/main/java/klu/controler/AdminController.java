package klu.controler;

import klu.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalUsers", profileRepository.countByRole("customer"));
        stats.put("totalProviders", providerRepository.count());
        stats.put("verifiedProviders", providerRepository.countByIsVerifiedTrue());
        stats.put("pendingVerifications", providerRepository.countByVerificationStatus("pending"));
        stats.put("totalBookings", bookingRepository.count());
        stats.put("completedBookings", bookingRepository.countByStatus("completed"));
        stats.put("pendingBookings", bookingRepository.countByStatus("pending"));
        stats.put("activeServices", serviceRepository.countByIsActiveTrue());
        stats.put("totalFeedback", feedbackRepository.count());

        BigDecimal revenue = bookingRepository.getTotalRevenue();
        stats.put("totalRevenue", revenue != null ? revenue : BigDecimal.ZERO);

        // Booking trends (last 7 days)
        List<Object[]> trends = bookingRepository.getBookingTrends(LocalDate.now().minusDays(7));
        List<Map<String, Object>> trendData = new ArrayList<>();
        for (Object[] row : trends) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", row[0]);
            point.put("count", row[1]);
            trendData.add(point);
        }
        stats.put("bookingTrends", trendData);

        // Most booked services
        List<Object[]> popularServices = bookingRepository.getMostBookedServices();
        List<Map<String, Object>> serviceData = new ArrayList<>();
        for (Object[] row : popularServices) {
            Map<String, Object> item = new HashMap<>();
            item.put("serviceName", row[0]);
            item.put("bookingCount", row[1]);
            serviceData.add(item);
        }
        stats.put("popularServices", serviceData);

        // Today's bookings
        stats.put("todayBookings", bookingRepository.countByBookingDate(LocalDate.now()));

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<klu.model.Profile>> getAllUsers() {
        return ResponseEntity.ok(profileRepository.findAll());
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<Map<String, Object>> toggleUserStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, Boolean> request) {
        Map<String, Object> response = new HashMap<>();

        return profileRepository.findById(id).map(profile -> {
            profile.setIsActive(request.getOrDefault("active", true));
            profileRepository.save(profile);
            response.put("status", 200);
            response.put("message", "User status updated");
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/feedback")
    public ResponseEntity<List<klu.model.Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackRepository.findAllByOrderByCreatedAtDesc());
    }

    @PatchMapping("/feedback/{id}")
    public ResponseEntity<Map<String, Object>> updateFeedbackStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        return feedbackRepository.findById(id).map(feedback -> {
            feedback.setStatus(request.get("status"));
            feedbackRepository.save(feedback);
            response.put("status", 200);
            response.put("message", "Feedback status updated");
            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/analytics/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        BigDecimal totalRevenue = bookingRepository.getTotalRevenue();
        analytics.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        analytics.put("totalBookings", bookingRepository.count());
        analytics.put("completedBookings", bookingRepository.countByStatus("completed"));
        analytics.put("cancelledBookings", bookingRepository.countByStatus("cancelled"));
        return ResponseEntity.ok(analytics);
    }
}
