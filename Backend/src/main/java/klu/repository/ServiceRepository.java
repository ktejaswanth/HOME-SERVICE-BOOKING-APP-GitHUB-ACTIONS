package klu.repository;

import klu.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface ServiceRepository extends JpaRepository<Service, UUID> {

    List<Service> findByCategoryAndIsActiveTrue(String category);

    List<Service> findByIsActiveTrueOrderByPopularityScoreDesc();

    List<Service> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);

    long countByIsActiveTrue();
}
