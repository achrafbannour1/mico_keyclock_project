package esprit.demandegestion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.web.bind.annotation.GetMapping;

@SpringBootApplication
@EnableDiscoveryClient
public class DemandeGestionApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemandeGestionApplication.class, args);
	}
	@GetMapping("/demande/test")
	public String testEndpoint() {
		System.out.println("DemandeGestion Service: Test endpoint accessed");
		return "DemandeGestion Service is running!";
	}
}
