package esprit.productgestion.restcontroller;

import esprit.productgestion.Services.IProductService;
import esprit.productgestion.Services.ProductService.ProductWithScore;
import esprit.productgestion.Services.TwitterService;
import esprit.productgestion.entity.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/product")
public class productRestController {

    private final IProductService iProductService;
    private final TwitterService twitterService;

    @Autowired
    public productRestController(IProductService iProductService, TwitterService twitterService) {
        this.iProductService = iProductService;
        this.twitterService = twitterService;
    }

    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        try {
            Product createdProduct = iProductService.addProduct(product);
            return ResponseEntity.ok(createdProduct);
        } catch (Exception e) {
            System.err.println("Error creating product: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return iProductService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id) {
        Optional<Product> product = iProductService.getProductById(id);
        return product.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable int id, @RequestBody Product productDetails) {
        try {
            Product updatedProduct = iProductService.updateProduct(id, productDetails);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable int id) {
        try {
            iProductService.deleteProduct(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/compare")
    public ResponseEntity<List<ProductWithScore>> compareProducts(@RequestBody CompareRequest request) {
        try {
            List<ProductWithScore> productsWithScores = iProductService.getProductsWithScores(
                    request.getProductIds(), request.getWeights()
            );
            if (productsWithScores.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(productsWithScores);
        } catch (Exception e) {
            System.err.println("Error comparing products: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/publish-product")
    public ResponseEntity<String> publishProduct(@RequestBody TweetRequest tweetRequest) {
        try {
            String tweet = tweetRequest.getTitle();
            if (tweet.length() > 280) {
                tweet = tweet.substring(0, 277) + "...";
            }
            String response = twitterService.postTweet(tweet, tweetRequest.getImageUrl());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error posting tweet: " + e.getMessage());
        }
    }

    @PostMapping("/publish-to-blog/{id}")
    public ResponseEntity<String> publishProductToBlog(@PathVariable int id, @RequestBody BlogPostRequest blogPostRequest) {
        try {
            String response = iProductService.postProductToBlog(id, blogPostRequest.getPostedBy());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error posting product to blog: " + e.getMessage());
        }
    }

    // DTO for comparison request
    public static class CompareRequest {
        private List<Integer> productIds;
        private Map<String, Double> weights;

        public List<Integer> getProductIds() {
            return productIds;
        }

        public void setProductIds(List<Integer> productIds) {
            this.productIds = productIds;
        }

        public Map<String, Double> getWeights() {
            return weights;
        }

        public void setWeights(Map<String, Double> weights) {
            this.weights = weights;
        }
    }

    // DTO for tweet request
    public static class TweetRequest {
        private String title;
        private String imageUrl;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }

    // DTO for blog post request
    public static class BlogPostRequest {
        private String postedBy;

        public String getPostedBy() { return postedBy; }
        public void setPostedBy(String postedBy) { this.postedBy = postedBy; }
    }

}