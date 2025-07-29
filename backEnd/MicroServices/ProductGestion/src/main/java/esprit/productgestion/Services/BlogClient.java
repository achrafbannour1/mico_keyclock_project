package esprit.productgestion.Services;

import esprit.productgestion.entity.BlogPostDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "blogs", url = "http://localhost:8081") // Fallback URL, overridden by Eureka
public interface BlogClient {

    @PostMapping("/api/blog/posts")
    ResponseEntity<?> createPost(@RequestBody BlogPostDTO post);
}