package klu.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import klu.model.Booking;
import klu.repository.BookingRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private JavaMailSender mailSender;

    public String bookService(Booking booking) {
        bookingRepository.save(booking);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("ktejaswanth05@gmail.com");
            message.setTo(booking.getCustomer().getEmail()); 
            message.setSubject("Service Booking Confirmation - HomeServe");
            message.setText("Dear " + booking.getCustomer().getFullName() + ",\n\n" +
                "Your booking is confirmed for " + booking.getBookingDate() + " at " + booking.getBookingTime() + ".\n" +
                "Service: " + booking.getService().getName() + "\n" +
                "Total Amount: ₹" + booking.getTotalPrice() + "\n\n" +
                "Thank you for choosing HomeServe!");

            mailSender.send(message);
        } catch (Exception e) {
            return "200::Booked, but failed to send email: " + e.getMessage();
        }

        return "200::Booking successful and email sent!";
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
