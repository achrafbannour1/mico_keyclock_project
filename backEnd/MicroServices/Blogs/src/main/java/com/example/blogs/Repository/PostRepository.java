package com.example.blogs.Repository;

import com.example.blogs.Entities.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
