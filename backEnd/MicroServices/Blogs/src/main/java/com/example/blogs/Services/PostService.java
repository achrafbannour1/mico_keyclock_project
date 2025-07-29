package com.example.blogs.Services;

import com.example.blogs.Entities.Post;

import java.util.List;

public interface PostService {

    Post savePost(Post post);
    Post updatePost(Long postId, Post postDetails);
    void deletePost(Long postId);
    List<Post> getAllPosts();
    Post getPostById(Long postId);
    String generateSummary(String content);
    boolean containsBannedWords(String content);


}
