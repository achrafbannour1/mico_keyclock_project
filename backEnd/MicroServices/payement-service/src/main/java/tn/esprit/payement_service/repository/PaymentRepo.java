package tn.esprit.payement_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.payement_service.entity.Payment;

import java.util.List;

@Repository
public interface PaymentRepo extends JpaRepository<Payment,Long> {
    List<Payment> findByOrderId(Long id);
}
