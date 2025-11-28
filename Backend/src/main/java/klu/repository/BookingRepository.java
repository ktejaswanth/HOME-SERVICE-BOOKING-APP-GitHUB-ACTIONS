package klu.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import klu.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

}
