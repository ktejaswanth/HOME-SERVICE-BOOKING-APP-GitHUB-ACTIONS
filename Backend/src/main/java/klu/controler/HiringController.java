package klu.controler;

import klu.model.HirerRequest;
import klu.model.EmailManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hiring")
@CrossOrigin
public class HiringController {

    @Autowired
    private EmailManager emailManager;

    @PostMapping("/submit")
    public String submitHiringForm(@RequestBody HirerRequest request) {
        String content = String.format(
            "New Hiring Request:\n\nName: %s %s\nEmail: %s\nContact Number: %s\n" +
            "Service Area: %s\nLocation: %s\nExperience: %s\n" +
            "Working Hours: %s\nExpectations: %s",
            request.getFirstName(), request.getLastName(), request.getEmail(), request.getContactNumber(),
            request.getServiceArea(), request.getLocation(), request.getExperience(),
            request.getWorkingHours(), request.getExpectations()
        );

        return emailManager.sendEmail("ktejaswanth05@gmail.com", "New Hirer Request", content);
    }
}
