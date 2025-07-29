package tn.esprit.payement_service.controller;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentRequest {
    private Long orderId;
    private double amount;
    private int quantity;
}
