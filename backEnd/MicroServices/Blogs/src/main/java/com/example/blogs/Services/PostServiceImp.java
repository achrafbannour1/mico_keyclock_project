package com.example.blogs.Services;

import com.example.blogs.Entities.Post;
import com.example.blogs.Repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostServiceImp implements PostService {

    @Autowired
    private PostRepository postRepository;
    private static final List<String> BANNED_WORDS = Arrays.asList("badword1", "badword2", "badword2");
    @Override
    public Post savePost(Post post) {
        for (String bannedWord : BANNED_WORDS) {
            if (post.getContent().toLowerCase().contains(bannedWord.toLowerCase())) {
                throw new IllegalArgumentException("Votre post contient des mots interdits.");
            }
        }
        post.setLikeCount(0);
        post.setViewCount(0);
        post.setDate(new Date());
        Post savedPost = postRepository.save(post);


        return savedPost;
    }

    @Override
    public boolean containsBannedWords(String content) {
        for (String bannedWord : BANNED_WORDS) {
            if (content.toLowerCase().contains(bannedWord.toLowerCase())) {
                return true;
            }
        }
        return false;
    }


    @Override
    public Post updatePost(Long postId, Post postDetails) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        if (!optionalPost.isPresent()) {
            throw new EntityNotFoundException("Post Not Found");
        }

        Post post = optionalPost.get();
        post.setName(postDetails.getName());
        post.setContent(postDetails.getContent());
        post.setImg(postDetails.getImg());

        post.setPostedBy(postDetails.getPostedBy());
        return postRepository.save(post);
    }

    @Override
    public void deletePost(Long postId) {
        if (postRepository.existsById(postId)) {
            try {
                postRepository.deleteById(postId);
            } catch (Exception e) {
                throw new RuntimeException("Erreur lors de la suppression du post", e);
            }
        } else {
            throw new EntityNotFoundException("Post Not Found");
        }



    }
    @Override
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
    public Post getPostById(Long postId) {
        Optional<Post> optionlPost = postRepository.findById(postId);
        if (optionlPost.isPresent()) {
            Post post = optionlPost.get();
            post.setViewCount(post.getViewCount() + 1);
            return postRepository.save(post);
        } else {
            throw new EntityNotFoundException("Post Not Found");

        }

    }
    public String generateSummary(String content) {
        if (content == null || content.trim().isEmpty()) {
            return "Résumé non disponible.";
        }

        System.out.println("Texte original : " + content); // Debugging

        // Liste simple de stopwords en français
        Set<String> stopwords = Set.of("le", "la", "les", "un", "une", "des", "et", "ou", "mais", "dans", "sur", "pour", "avec", "de", "du", "à", "en");

        // Séparer en phrases
        String[] sentences = content.split("(?<=[.!?])\\s+");
        if (sentences.length == 0) {
            return "Résumé non disponible.";
        }
        if (sentences.length == 1) {
            return sentences[0];
        }

        // Calculer la fréquence des mots significatifs
        Map<String, Integer> wordFrequency = new HashMap<>();
        for (String sentence : sentences) {
            for (String word : sentence.split("\\s+")) {
                word = word.toLowerCase().replaceAll("[^a-zA-Zàâäéèêëîïôöùûüç]", ""); // Nettoyage avec accents français
                if (!word.isEmpty() && !stopwords.contains(word)) { // Exclure stopwords
                    wordFrequency.put(word, wordFrequency.getOrDefault(word, 0) + 1);
                }
            }
        }

        // Évaluer les phrases avec un score pondéré
        List<Map.Entry<String, Double>> scoredSentences = new ArrayList<>();
        for (int i = 0; i < sentences.length; i++) {
            String sentence = sentences[i];
            double score = scoreSentence(sentence, wordFrequency);
            // Bonus pour les phrases au début (introduction) ou à la fin (conclusion)
            double positionBonus = (i == 0 || i == sentences.length - 1) ? 1.5 : 1.0;
            scoredSentences.add(Map.entry(sentence, score * positionBonus));
        }

        // Trier par score décroissant et limiter à 2 phrases max
        List<String> summarySentences = scoredSentences.stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(2) // Maximum 2 phrases pour un résumé concis
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        // Combiner les phrases en un résumé
        String summary = String.join(" ", summarySentences).trim();
        System.out.println("Résumé généré : " + summary); // Debugging
        return summary.isEmpty() ? sentences[0] : summary;
    }

    // Méthode pour évaluer l'importance d'une phrase
    private double scoreSentence(String sentence, Map<String, Integer> wordFrequency) {
        String[] words = sentence.split("\\s+");
        if (words.length == 0) return 0.0;

        double totalScore = Arrays.stream(words)
                .map(word -> word.toLowerCase().replaceAll("[^a-zA-Zàâäéèêëîïôöùûüç]", ""))
                .filter(word -> !word.isEmpty())
                .mapToInt(word -> wordFrequency.getOrDefault(word, 0))
                .sum();

        // Normaliser par la longueur pour éviter de favoriser les phrases trop longues
        return totalScore / Math.sqrt(words.length);
    }


}
