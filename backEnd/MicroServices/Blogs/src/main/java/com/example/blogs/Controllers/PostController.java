package com.example.blogs.Controllers;

import com.example.blogs.Entities.Post;
import com.example.blogs.Services.PostService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blog/posts")

public class PostController {
    @Autowired
    private PostService postService;

    @PostMapping

    public ResponseEntity<?> createPost(@RequestBody Post post) {
        try {
            Post createdPost = postService.savePost(post);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(postService.getAllPosts());

        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?>getPostById(@PathVariable Long postId) {

        try {
            Post post = postService.getPostById(postId);
            return ResponseEntity.ok(post);
        }catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());


        }
    }
    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable Long postId, @RequestBody Post postDetails) {
        try {
            Post updatedPost = postService.updatePost(postId, postDetails);
            return ResponseEntity.ok(updatedPost);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId) {
        try {
            postService.deletePost(postId);
            return ResponseEntity.ok("Post supprimé avec succès");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post non trouvé");
        } catch (Exception e) {
            // Loguer l'exception pour avoir des informations sur l'erreur
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne lors de la suppression");
        }
    }
    @GetMapping("/{postId}/summary")
    public ResponseEntity<?> getSummary(@PathVariable Long postId) {
        try {
            Post post = postService.getPostById(postId);
            String summary = postService.generateSummary(post.getContent());

            System.out.println("Résumé généré : " + summary); // Debugging

            return ResponseEntity.ok(summary);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post non trouvé");
        }
    }
}
