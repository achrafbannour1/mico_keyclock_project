package tn.esprit.payement_service.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;
    private double amount;

    private LocalDate paymentDate;
    private String paymentReference;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
}
