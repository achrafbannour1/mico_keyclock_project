package tn.esprit.payement_service.service;


import jakarta.ws.rs.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.payement_service.entity.Payment;
import tn.esprit.payement_service.entity.PaymentStatus;
import tn.esprit.payement_service.repository.PaymentRepo;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@Service
public class PaymentServiceImpl implements PaymentService{
    PaymentRepo paymentRepository;
    @Override
    public Payment createPayment(Payment payment) {
        payment.setPaymentDate(LocalDate.now());

        payment.setStatus(PaymentStatus.SUCCESS); // Par défaut
        return paymentRepository.save(payment);
    }

    @Override
    public Payment getPaymentById(Long id) {
         return paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paiement introuvable"));
    }

    @Override
    public List<Payment> getPaymentsByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    @Override
    public Payment updatePaymentStatus(Long paymentId, String paymentReference) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Paiement introuvable"));

        // Mise à jour du statut du paiement et de la référence de paiement
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaymentReference(paymentReference);

        return paymentRepository.save(payment);
    }

    @Override
    public List<Payment> getAllPayment() {
        return paymentRepository.findAll();
    }
}
