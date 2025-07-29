package esprit.usergestion.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import esprit.usergestion.Services.EmailService;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest emailRequest) {
        try {
            emailService.sendMeetingInvitation(emailRequest.getTo(), emailRequest.getSubject(), emailRequest.getBody());
            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send email: " + e.getMessage());
        }
    }
}
class EmailRequest {
    private String to;
    private String subject;
    private String body;

    // Getters and setters
    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
}