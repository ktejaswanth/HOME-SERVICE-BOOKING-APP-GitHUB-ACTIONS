package klu.controler;


import klu.model.ContactMessage;
import klu.model.EmailManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {
    @Autowired
    private EmailManager emailManager;
    @PostMapping
    public String sendContact(@RequestBody ContactMessage message) {
        return emailManager.sendContactEmail(
            message.getName(),
            message.getEmail(),
            message.getMessage()
        );
    }


}
