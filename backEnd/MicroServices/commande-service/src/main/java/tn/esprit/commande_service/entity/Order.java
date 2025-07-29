package tn.esprit.commande_service.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity(name = "orderTable")
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate orderDate;
    @Enumerated(EnumType.STRING)
    private Status status; // e.g. PENDING, PAID, CANCELED
    private Double totalAmount;
    private String customerId;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)


    private List<OrderLine> orderLines;

}
