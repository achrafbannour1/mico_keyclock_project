package tn.esprit.commande_service.service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.commande_service.entity.Order;
import tn.esprit.commande_service.entity.Status;
import tn.esprit.commande_service.repository.OrderRepo;

import java.time.LocalDate;
import java.util.List;


@AllArgsConstructor
@Service
public class OrderServiceImpl implements OrderService{

   OrderRepo orderRepo;
    @Override
    public Order createOrder(Order order) {
        System.out.println(order);
        double totalAmount = order.getOrderLines().stream()
                .mapToDouble(line -> line.getUnitPrice() * line.getQuantity())
                .sum();
        order.setTotalAmount(totalAmount);
        order.setStatus(Status.CREATED);
        order.setOrderDate(LocalDate.now());
        order.getOrderLines().forEach(line -> line.setOrder(order));

        return orderRepo.save(order);
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public List<Order> getOrdersByCustomer(String customerId) {
        return orderRepo.findByCustomerId(customerId);
    }

    @Override
    public void updateOrderStatus(Long orderId, Status status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        orderRepo.save(order);
    }

    @Override
    public List<Order> getAll() {
        return orderRepo.findAll();
    }
}
