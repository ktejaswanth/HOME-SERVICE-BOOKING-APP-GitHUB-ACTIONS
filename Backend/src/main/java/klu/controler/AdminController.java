package klu.controler;

import klu.model.AdminStats;
import klu.model.UserGrowthTrend;
import klu.repository.UsersRepository;
import klu.repository.BookingRepository;
import klu.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")  // Allow frontend requests
@RestController
public class AdminController {
	  @Autowired
	    private UsersRepository usersRepository;

	    @Autowired
	    private BookingRepository bookingRepository;

	    @Autowired
	    private FeedbackRepository feedbackRepository;

	    @GetMapping("/api/admin/stats")
	    public AdminStats getAdminStats() {
	        long userCount = usersRepository.count();
	        long bookingCount = bookingRepository.count();
	        long feedbackCount = feedbackRepository.count();

	        List<UserGrowthTrend> userTrends = fetchUserGrowthTrends();

	        return new AdminStats(userCount, bookingCount, feedbackCount, userTrends);
	    }

	 // Sample static data - replace this logic with database-based logic as needed
	    private List<UserGrowthTrend> fetchUserGrowthTrends() {
	        List<UserGrowthTrend> trends = new ArrayList<>();
	        trends.add(new UserGrowthTrend(LocalDate.now().minusDays(2), 100));
	        trends.add(new UserGrowthTrend(LocalDate.now().minusDays(1), 120));
	        trends.add(new UserGrowthTrend(LocalDate.now(), 150));
	        return trends;
	    }
}
