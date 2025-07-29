package tn.esprit.commande_service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Builder
public class OrderLine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private int quantity;
    private double unitPrice;
    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;
}
