package esprit.productgestion.entity;

import lombok.Data;

@Data
public class BlogPostDTO {
    private String name;
    private String content;
    private String postedBy;
    private String img;
}