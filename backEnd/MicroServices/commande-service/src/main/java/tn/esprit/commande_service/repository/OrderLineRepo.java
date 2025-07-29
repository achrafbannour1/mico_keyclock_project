package tn.esprit.commande_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.commande_service.entity.OrderLine;

@Repository
public interface OrderLineRepo extends JpaRepository<OrderLine,Long> {
}
