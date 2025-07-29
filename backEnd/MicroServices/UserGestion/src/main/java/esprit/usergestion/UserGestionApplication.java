package esprit.usergestion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableDiscoveryClient
@RestController
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class UserGestionApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserGestionApplication.class, args);
	}

	@GetMapping("/user/test")
	public String testEndpoint() {
		System.out.println("UserGestion Service: Test endpoint accessed");
		return "UserGestion Service is running!";
	}
}
