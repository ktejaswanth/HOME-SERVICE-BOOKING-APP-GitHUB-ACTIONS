package klu.controler;

import klu.model.Service;
import klu.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {
        return ResponseEntity.ok(serviceRepository.findByIsActiveTrueOrderByPopularityScoreDesc());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Service>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(serviceRepository.findByCategoryAndIsActiveTrue(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Service>> searchServices(@RequestParam String q) {
        return ResponseEntity.ok(serviceRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable UUID id) {
        return serviceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Service> createService(@RequestBody Service service) {
        return ResponseEntity.ok(serviceRepository.save(service));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(@PathVariable UUID id, @RequestBody Service serviceData) {
        return serviceRepository.findById(id).map(service -> {
            if (serviceData.getName() != null) service.setName(serviceData.getName());
            if (serviceData.getDescription() != null) service.setDescription(serviceData.getDescription());
            if (serviceData.getCategory() != null) service.setCategory(serviceData.getCategory());
            if (serviceData.getBasePrice() != null) service.setBasePrice(serviceData.getBasePrice());
            if (serviceData.getDurationMinutes() != null) service.setDurationMinutes(serviceData.getDurationMinutes());
            if (serviceData.getIconUrl() != null) service.setIconUrl(serviceData.getIconUrl());
            return ResponseEntity.ok(serviceRepository.save(service));
        }).orElse(ResponseEntity.notFound().build());
    }
}
