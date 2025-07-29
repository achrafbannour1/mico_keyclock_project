package tn.esprit.commande_service.service;

import tn.esprit.commande_service.entity.Order;
import tn.esprit.commande_service.entity.Status;

import java.util.List;

public interface OrderService {
    public Order createOrder(Order order);
    public Order getOrderById(Long id);
    public List<Order> getOrdersByCustomer(String customerId);
    public void updateOrderStatus(Long orderId, Status status);
    public List<Order> getAll();
}
