package klu.repository;

import klu.model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, UUID> {

    Optional<Provider> findByProfileId(UUID profileId);

    List<Provider> findByIsVerifiedTrueAndIsAvailableTrue();

    List<Provider> findByVerificationStatus(String status);

    @Query("SELECT p FROM Provider p WHERE p.isVerified = true AND p.isAvailable = true ORDER BY p.rating DESC")
    List<Provider> findTopRatedProviders();

    @Query("SELECT p FROM Provider p WHERE p.isVerified = true AND p.isAvailable = true " +
           "AND (6371 * acos(cos(radians(:lat)) * cos(radians(p.latitude)) * " +
           "cos(radians(p.longitude) - radians(:lng)) + sin(radians(:lat)) * " +
           "sin(radians(p.latitude)))) <= :radius ORDER BY p.rating DESC")
    List<Provider> findNearbyProviders(double lat, double lng, double radius);

    long countByIsVerifiedTrue();

    long countByVerificationStatus(String status);
}
