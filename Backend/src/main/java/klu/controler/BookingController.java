package klu.controler;

import klu.model.Booking;
import klu.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/bookings")
public class BookingController {
	  @Autowired
	    private BookingService bookingService;

	    @PostMapping
	    public String bookService(@RequestBody Booking booking) {
	        return bookingService.bookService(booking);
	    }

}
