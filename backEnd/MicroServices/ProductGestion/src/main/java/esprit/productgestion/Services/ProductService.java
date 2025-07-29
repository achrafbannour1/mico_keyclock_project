package esprit.productgestion.Services;

import esprit.productgestion.Repository.ProductRepository;

import esprit.productgestion.entity.BlogPostDTO;
import esprit.productgestion.entity.Product;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService implements IProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;
    private final BlogClient blogClient;

    public ProductService(ProductRepository productRepository, BlogClient blogClient) {
        this.productRepository = productRepository;
        this.blogClient = blogClient;
    }

    @Override
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Optional<Product> getProductById(int id) {
        return productRepository.findById(id);
    }

    @Override
    public Product updateProduct(int id, Product productDetails) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            product.setDesignation(productDetails.getDesignation());
            product.setPrix(productDetails.getPrix());
            product.setDiscount(productDetails.getDiscount());
            product.setTauxRemise(productDetails.getTauxRemise());
            product.setImage(productDetails.getImage());
            product.setArticle(productDetails.getArticle());
            product.setCategory(productDetails.getCategory());
            product.setMarque(productDetails.getMarque());
            return productRepository.save(product);
        } else {
            throw new RuntimeException("Product not found with id: " + id);
        }
    }

    @Override
    public void deleteProduct(int id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
        } else {
            throw new RuntimeException("Product not found with id: " + id);
        }
    }

    @Override
    public List<Product> getProductsByIds(List<Integer> ids) {
        return productRepository.findAllById(ids).stream()
                .filter(product -> ids.contains(product.getId()))
                .collect(Collectors.toList());
    }

    public List<ProductWithScore> getProductsWithScores(List<Integer> ids, Map<String, Double> weights) {
        List<Product> products = getProductsByIds(ids);
        if (products.isEmpty()) {
            return List.of();
        }

        double maxPrice = products.stream().mapToDouble(Product::getPrix).max().orElse(1.0);
        double maxDiscount = products.stream().mapToDouble(Product::getDiscount).max().orElse(1.0);
        double maxTauxRemise = products.stream().mapToDouble(Product::getTauxRemise).max().orElse(1.0);

        return products.stream().map(product -> {
            double score = 0.0;
            if (weights.containsKey("price")) {
                score += weights.get("price") * (1.0 - product.getPrix() / maxPrice);
            }
            if (weights.containsKey("discount")) {
                score += weights.get("discount") * (product.getDiscount() / maxDiscount);
            }
            if (weights.containsKey("tauxRemise")) {
                score += weights.get("tauxRemise") * (product.getTauxRemise() / maxTauxRemise);
            }
            return new ProductWithScore(product, score);
        }).collect(Collectors.toList());
    }

    public String postProductToBlog(int productId, String postedBy) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (!optionalProduct.isPresent()) {
            throw new RuntimeException("Product not found with id: " + productId);
        }

        Product product = optionalProduct.get();
        BlogPostDTO post = new BlogPostDTO();
        post.setName("New Product: " + product.getDesignation());
        post.setContent("Discover our latest product: " + product.getDesignation() +
                ". Price: $" + product.getPrix() +
                ", Discount: " + product.getDiscount() + "%" +
                ", Category: " + product.getCategory() +
                ", Brand: " + product.getMarque() +
                ". Article: " + product.getArticle());
        post.setPostedBy(postedBy);
        post.setImg(product.getImage());

        try {
            ResponseEntity<?> response = blogClient.createPost(post);
            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Successfully posted product {} to blog", productId);
                return "Product posted to blog successfully";
            } else {
                logger.error("Failed to post product {} to blog: {}", productId, response.getBody());
                throw new RuntimeException("Failed to post product to blog: " + response.getBody());
            }
        } catch (Exception e) {
            logger.error("Error posting product {} to blog: {}", productId, e.getMessage());
            throw new RuntimeException("Error posting product to blog: " + e.getMessage(), e);
        }
    }

    public static class ProductWithScore {
        private final Product product;
        private final double score;

        public ProductWithScore(Product product, double score) {
            this.product = product;
            this.score = score;
        }

        public Product getProduct() {
            return product;
        }

        public double getScore() {
            return score;
        }
    }
}