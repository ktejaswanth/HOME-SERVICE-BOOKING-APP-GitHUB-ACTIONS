package klu.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "providers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "profile_id", nullable = false, unique = true)
    private Profile profile;

    @Column(name = "specialization", columnDefinition = "text[]")
    private String specialization;

    @Column(name = "experience_years")
    private Integer experienceYears = 0;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(name = "total_reviews")
    private Integer totalReviews = 0;

    @Column(name = "total_jobs_completed")
    private Integer totalJobsCompleted = 0;

    @Column(name = "hourly_rate")
    private BigDecimal hourlyRate;

    private String bio;

    @Column(name = "certifications", columnDefinition = "text[]")
    private String certifications;

    @Column(name = "aadhaar_verified")
    private Boolean aadhaarVerified = false;

    @Column(name = "background_verified")
    private Boolean backgroundVerified = false;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "verification_status")
    private String verificationStatus = "pending";

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    private Double latitude;
    private Double longitude;

    @Column(name = "service_radius_km")
    private BigDecimal serviceRadiusKm = new BigDecimal("10.00");

    @Column(name = "total_earnings")
    private BigDecimal totalEarnings = BigDecimal.ZERO;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
    }
}
