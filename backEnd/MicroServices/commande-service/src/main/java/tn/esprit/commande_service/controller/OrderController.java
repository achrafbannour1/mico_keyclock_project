package tn.esprit.commande_service.controller;


import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.commande_service.entity.Order;
import tn.esprit.commande_service.entity.Status;
import tn.esprit.commande_service.service.OrderService;

import java.util.List;
@AllArgsConstructor
@RequestMapping("/order")
@RestController
public class OrderController {
    OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        System.out.println(order);
        return ResponseEntity.ok(orderService.createOrder(order));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getOrdersByCustomer(@PathVariable String customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customerId));
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam Status status
    ) {
        orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/getAll")
    public List<Order> getAll(){
        return orderService.getAll();
    }
}
