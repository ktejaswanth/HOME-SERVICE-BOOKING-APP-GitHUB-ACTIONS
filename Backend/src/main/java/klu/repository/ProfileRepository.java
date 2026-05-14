package klu.repository;

import klu.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID> {

    Optional<Profile> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Profile> findByRole(String role);

    List<Profile> findByCity(String city);

    @Query("SELECT COUNT(p) FROM Profile p WHERE p.role = :role")
    long countByRole(String role);

    @Query("SELECT COUNT(p) FROM Profile p WHERE p.isActive = true")
    long countActiveUsers();

    @Query("SELECT p FROM Profile p WHERE p.role = 'customer' ORDER BY p.createdAt DESC")
    List<Profile> findRecentCustomers();
}
