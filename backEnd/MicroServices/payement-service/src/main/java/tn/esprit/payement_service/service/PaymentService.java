package tn.esprit.payement_service.service;

import tn.esprit.payement_service.entity.Payment;

import java.util.List;

public interface PaymentService {
    Payment createPayment(Payment payment);
    Payment getPaymentById(Long id);
    List<Payment> getPaymentsByOrderId(Long orderId);
    public Payment updatePaymentStatus(Long paymentId, String paymentReference);
    List<Payment> getAllPayment();
}
