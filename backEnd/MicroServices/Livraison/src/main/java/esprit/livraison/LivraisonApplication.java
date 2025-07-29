package esprit.livraison;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableDiscoveryClient
@RestController
public class LivraisonApplication {

	public static void main(String[] args) {
		SpringApplication.run(LivraisonApplication.class, args);
	}

	@GetMapping("/livraison/test")
	public String testEndpoint() {
		System.out.println("Livraison Service: Test endpoint accessed");
		return "Livraison Service is running!";
	}

}
