package klu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import klu.model.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long>{

}
