package klu.repository;

import klu.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByCustomerIdOrderByCreatedAtDesc(UUID customerId);

    List<Booking> findByProviderIdOrderByBookingDateDesc(UUID providerId);

    List<Booking> findByStatus(String status);

    List<Booking> findByBookingDate(LocalDate date);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    long countByStatus(String status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.bookingDate = :date")
    long countByBookingDate(LocalDate date);

    @Query("SELECT b FROM Booking b ORDER BY b.createdAt DESC")
    List<Booking> findRecentBookings();

    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.status = 'completed'")
    java.math.BigDecimal getTotalRevenue();

    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.status = 'completed' AND b.provider.id = :providerId")
    java.math.BigDecimal getProviderEarnings(UUID providerId);

    @Query("SELECT b.service.name, COUNT(b) FROM Booking b GROUP BY b.service.name ORDER BY COUNT(b) DESC")
    List<Object[]> getMostBookedServices();

    @Query("SELECT CAST(b.bookingDate AS string), COUNT(b) FROM Booking b WHERE b.bookingDate >= :fromDate GROUP BY b.bookingDate ORDER BY b.bookingDate")
    List<Object[]> getBookingTrends(LocalDate fromDate);
}
