package klu.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private Profile user;

    @Column(name = "plan_name", nullable = false)
    private String planName; // basic, premium, enterprise

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "features", columnDefinition = "text[]")
    private String features;

    @Column(name = "starts_at")
    private OffsetDateTime startsAt;

    @Column(name = "expires_at", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "auto_renew")
    private Boolean autoRenew = true;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        if (startsAt == null) startsAt = OffsetDateTime.now();
    }
}
