package esprit.productgestion.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Product {
    @Id
    @GeneratedValue
    int id;
    private String designation;
    private float prix;
    private int discount;
    private float tauxRemise;
    private String image;
    private String article;
    private String category;
    private String marque;
}
