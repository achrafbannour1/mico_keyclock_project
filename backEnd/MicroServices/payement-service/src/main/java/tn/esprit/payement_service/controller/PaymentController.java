package tn.esprit.payement_service.controller;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.payement_service.controller.PaymentRequest;
import tn.esprit.payement_service.entity.Payment;
import tn.esprit.payement_service.service.PaymentService;

import java.util.*;
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

     private final PaymentService paymentService;
    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostMapping("/create-checkout-session")
    public Map<String, String> createCheckoutSession(@RequestBody PaymentRequest request) throws Exception {
        Stripe.apiKey = stripeSecretKey;

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:4200/success") // à adapter
                .setCancelUrl("http://localhost:4200/cancel")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity((long) request.getQuantity())
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("eur")
                                                .setUnitAmount((long) (request.getAmount() * 100)) // en centimes
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Commande #" + request.getOrderId())
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();

        Session session = Session.create(params);

        Map<String, String> responseData = new HashMap<>();
        responseData.put("sessionId", session.getId());

        return responseData;
    }
    @PostMapping("/create")
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        Payment createdPayment = paymentService.createPayment(payment);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPayment);
    }

    @PutMapping("/update/{paymentId}")
    public ResponseEntity<Payment> updatePaymentStatus(@PathVariable Long paymentId, @RequestBody String paymentReference) {
        Payment updatedPayment = paymentService.updatePaymentStatus(paymentId, paymentReference);
        return ResponseEntity.ok(updatedPayment);
    }
    @GetMapping
    public List<Payment> getAllPayment(){
        return paymentService.getAllPayment();
    }
}
