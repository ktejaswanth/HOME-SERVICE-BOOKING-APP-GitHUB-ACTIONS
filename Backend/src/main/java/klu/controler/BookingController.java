package klu.controler;

import klu.model.*;
import klu.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private JWTManager jwtManager;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createBooking(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        String email = jwtManager.validateToken(authHeader.replace("Bearer ", ""));
        if ("401".equals(email)) {
            response.put("status", 401);
            response.put("message", "Unauthorized");
            return ResponseEntity.status(401).body(response);
        }

        Optional<Profile> customerOpt = profileRepository.findByEmail(email);
        if (customerOpt.isEmpty()) {
            response.put("status", 404);
            response.put("message", "Customer not found");
            return ResponseEntity.status(404).body(response);
        }

        UUID serviceId = UUID.fromString((String) request.get("serviceId"));
        Optional<Service> serviceOpt = serviceRepository.findById(serviceId);
        if (serviceOpt.isEmpty()) {
            response.put("status", 404);
            response.put("message", "Service not found");
            return ResponseEntity.status(404).body(response);
        }

        Booking booking = new Booking();
        booking.setCustomer(customerOpt.get());
        booking.setService(serviceOpt.get());
        booking.setBookingDate(LocalDate.parse((String) request.get("bookingDate")));
        booking.setBookingTime(java.time.LocalTime.parse((String) request.get("bookingTime")));
        booking.setAddress((String) request.get("address"));
        booking.setCity((String) request.getOrDefault("city", "Bangalore"));
        booking.setWorkersNeeded((Integer) request.getOrDefault("workersNeeded", 1));
        booking.setSpecialInstructions((String) request.get("specialInstructions"));

        BigDecimal servicePrice = new BigDecimal(request.get("servicePrice").toString());
        BigDecimal appFee = new BigDecimal(request.getOrDefault("appFee", "49").toString());
        BigDecimal discount = new BigDecimal(request.getOrDefault("discount", "0").toString());
        BigDecimal totalPrice = servicePrice.add(appFee).subtract(discount);

        booking.setServicePrice(servicePrice);
        booking.setAppFee(appFee);
        booking.setDiscount(discount);
        booking.setTotalPrice(totalPrice);
        booking.setStatus("pending");

        // Auto-assign provider if providerId given
        if (request.containsKey("providerId") && request.get("providerId") != null) {
            UUID providerId = UUID.fromString((String) request.get("providerId"));
            providerRepository.findById(providerId).ifPresent(booking::setProvider);
            booking.setStatus("confirmed");
        }

        Booking saved = bookingRepository.save(booking);

        response.put("status", 200);
        response.put("message", "Booking created successfully");
        response.put("bookingId", saved.getId());
        response.put("booking", saved);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(@RequestHeader("Authorization") String authHeader) {
        String email = jwtManager.validateToken(authHeader.replace("Bearer ", ""));
        if ("401".equals(email)) return ResponseEntity.status(401).build();

        Optional<Profile> profileOpt = profileRepository.findByEmail(email);
        if (profileOpt.isEmpty()) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(bookingRepository.findByCustomerIdOrderByCreatedAtDesc(profileOpt.get().getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable UUID id) {
        return bookingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isEmpty()) {
            response.put("status", 404);
            response.put("message", "Booking not found");
            return ResponseEntity.status(404).body(response);
        }

        Booking booking = bookingOpt.get();
        String newStatus = request.get("status");
        booking.setStatus(newStatus);

        if ("completed".equals(newStatus)) {
            booking.setCompletedAt(OffsetDateTime.now());
        }
        if ("cancelled".equals(newStatus)) {
            booking.setCancellationReason(request.get("reason"));
        }

        bookingRepository.save(booking);

        response.put("status", 200);
        response.put("message", "Booking status updated to: " + newStatus);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findRecentBookings());
    }
}
