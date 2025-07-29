package tn.esprit.commande_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.commande_service.entity.Order;

import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Order,Long> {
    List<Order> findByCustomerId(String customerId);
}
