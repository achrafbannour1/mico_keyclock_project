package esprit.usergestion.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.logging.Logger;
@Service
public class EmailService {

    private static final Logger logger = Logger.getLogger(EmailService.class.getName());

   // @Autowired
    //private JavaMailSender mailSender;

    public void sendMeetingInvitation(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("your-email@gmail.com"); // Replace with your email
           // mailSender.send(message);
            logger.info("Email sent successfully to " + to);
        } catch (Exception e) {
            logger.severe("Failed to send email: " + e.getMessage());
            throw e; // Re-throw to let the controller handle it
        }
    }
}