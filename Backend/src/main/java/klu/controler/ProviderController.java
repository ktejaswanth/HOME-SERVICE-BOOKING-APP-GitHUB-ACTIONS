package klu.controler;

import klu.model.Provider;
import klu.model.Profile;
import klu.repository.ProviderRepository;
import klu.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin(origins = "*")
public class ProviderController {

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @GetMapping("/public/top")
    public ResponseEntity<List<Provider>> getTopProviders() {
        return ResponseEntity.ok(providerRepository.findTopRatedProviders());
    }

    @GetMapping("/public/nearby")
    public ResponseEntity<List<Provider>> getNearbyProviders(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "10") double radius) {
        return ResponseEntity.ok(providerRepository.findNearbyProviders(lat, lng, radius));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Provider> getProvider(@PathVariable UUID id) {
        return providerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Provider>> getPendingProviders() {
        return ResponseEntity.ok(providerRepository.findByVerificationStatus("pending"));
    }

    @PatchMapping("/{id}/verify")
    public ResponseEntity<Map<String, Object>> verifyProvider(
            @PathVariable UUID id,
            @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        Optional<Provider> providerOpt = providerRepository.findById(id);
        if (providerOpt.isEmpty()) {
            response.put("status", 404);
            response.put("message", "Provider not found");
            return ResponseEntity.status(404).body(response);
        }

        Provider provider = providerOpt.get();
        String action = request.get("action"); // "approve" or "reject"

        if ("approve".equals(action)) {
            provider.setVerificationStatus("approved");
            provider.setIsVerified(true);
            provider.setIsAvailable(true);
            response.put("message", "Provider approved successfully");
        } else {
            provider.setVerificationStatus("rejected");
            provider.setIsVerified(false);
            response.put("message", "Provider rejected");
        }

        providerRepository.save(provider);
        response.put("status", 200);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<Map<String, Object>> toggleAvailability(
            @PathVariable UUID id,
            @RequestBody Map<String, Boolean> request) {
        Map<String, Object> response = new HashMap<>();

        Optional<Provider> providerOpt = providerRepository.findById(id);
        if (providerOpt.isEmpty()) {
            response.put("status", 404);
            response.put("message", "Provider not found");
            return ResponseEntity.status(404).body(response);
        }

        Provider provider = providerOpt.get();
        provider.setIsAvailable(request.getOrDefault("available", true));
        providerRepository.save(provider);

        response.put("status", 200);
        response.put("message", "Availability updated");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProvider(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        Optional<Provider> providerOpt = providerRepository.findById(id);
        if (providerOpt.isEmpty()) {
            response.put("status", 404);
            response.put("message", "Provider not found");
            return ResponseEntity.status(404).body(response);
        }

        Provider provider = providerOpt.get();
        if (request.containsKey("bio")) provider.setBio((String) request.get("bio"));
        if (request.containsKey("experienceYears")) provider.setExperienceYears((Integer) request.get("experienceYears"));
        if (request.containsKey("hourlyRate")) provider.setHourlyRate(new java.math.BigDecimal(request.get("hourlyRate").toString()));

        providerRepository.save(provider);
        response.put("status", 200);
        response.put("message", "Provider profile updated");
        response.put("provider", provider);
        return ResponseEntity.ok(response);
    }
}
