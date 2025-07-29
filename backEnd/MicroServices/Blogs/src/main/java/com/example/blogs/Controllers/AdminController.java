package com.example.blogs.Controllers;
import com.example.blogs.Entities.Post;
import com.example.blogs.Services.PostService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



import java.util.List;



@RestController
@RequestMapping("/api/blog/admin")

public class AdminController {

    @Autowired
    private PostService postService;

    public AdminController(PostService postService) {
        this.postService = postService;

    }

    @GetMapping("/posts")
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<Post> getPostWithComments(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPostById(postId));
    }


    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        try {
            postService.deletePost(postId);  // Assurez-vous que cette méthode est correctement définie dans le service
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(null);  // Post non trouvé
        } catch (Exception e) {
            return ResponseEntity.status(500).build();  // Erreur interne
        }
    }
}


