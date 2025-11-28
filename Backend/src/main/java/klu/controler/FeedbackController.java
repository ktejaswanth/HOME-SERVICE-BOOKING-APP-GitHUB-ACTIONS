package klu.controler;
import klu.model.Feedback;
import klu.repository.FeedbackRepository;
import klu.model.EmailManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/feedback")
public class FeedbackController {
	 @Autowired
	    private FeedbackRepository feedbackRepo;

	    @Autowired
	    private EmailManager emailManager;

	    @PostMapping("/send")
	    public String sendFeedback(@RequestBody Feedback feedback) {
	        feedbackRepo.save(feedback);

	        String subject = "New Feedback Received";
	        String content = "Feedback from: " + (feedback.getEmail() != null ? feedback.getEmail() : "Anonymous") + 
	                         "\n\nMessage:\n" + feedback.getMessage();

	        return emailManager.sendEmail("ktejaswanth05@gmail.com", subject, content);
	    }

}
