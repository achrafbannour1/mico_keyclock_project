package esprit.productgestion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableDiscoveryClient
@RestController
@EnableFeignClients
public class ProductGestionApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductGestionApplication.class, args);
	}
	@GetMapping("/product/test")
	public String testEndpoint() {
		System.out.println("ProductGestion Service: Test endpoint accessed");
		return "ProductGestion Service is running!";
	}

}
