package klu.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailManager {

    @Autowired
    private JavaMailSender mailSender;

    private static final String FROM_EMAIL = "ktejaswanth05@gmail.com";


    public String sendEmail(String toEmail, String subject, String message) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(FROM_EMAIL);
            mailMessage.setTo(toEmail);
            mailMessage.setSubject(subject);
            mailMessage.setText(message);
            mailSender.send(mailMessage);
            return "200::Password sent to the registered email";
        } catch (Exception e) {
            return "401::" + e.getMessage();
        }
    }

    public String sendContactEmail(String name, String email, String message) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(FROM_EMAIL);
            mail.setTo(FROM_EMAIL);  // sending to yourself
            mail.setSubject("New Contact Message from " + name);
            mail.setText(
                "Contact Name: " + name + "\n" +
                "Contact Email: " + email + "\n\n" +
                "Message:\n" + message
            );
            mailSender.send(mail);
            return "200::Contact message sent successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "401::Failed to send contact message: " + e.getMessage();
        }
    }
}
