package esprit.usergestion.restController;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class userRestController {
    private String title="Hello, i'm the user Micro-Service";
    @RequestMapping("/hello")
    public String sayHello(){
        System.out.println(title);
        return title;
    }
}
