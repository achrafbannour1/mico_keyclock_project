package esprit.getway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@EnableDiscoveryClient

public class GetwayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GetwayApplication.class, args);
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder){
        return builder.routes()
                .route("user", r -> r.path("/user/**").uri("lb://user"))
                .route("commande-service", r -> r.path("/commande/**").uri("lb://commande-service"))
                .route("blogs", r -> r.path("/api/blog/**").uri("lb://blogs"))
                .route("demandeGestion", r -> r.path("/api/demandes/**").uri("lb://demandeGestion"))
                .route("Livraison", r -> r.path("/Livraison/**").uri("lb://Livraison"))
                .route("payement-service", r -> r.path("/payment/**").uri("lb://payement-service"))
                .route("ProductGestion", r -> r.path("/product/**").uri("lb://ProductGestion"))
                .route("email", r -> r.path("/api/email/**").uri("lb://ProductGestion"))
                .route("userGestion", r -> r.path("/userGestion/**").uri("lb://userGestion"))
                .build();

    }
}
