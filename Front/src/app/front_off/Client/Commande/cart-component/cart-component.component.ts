import { Component } from '@angular/core';
import {OrderLine,Order } from "../../../../models/order.model";
import {CartService} from "../../../../services/cart/cart.service";
import {OrderService} from "../../../../services/cart/order.service";
import {StripeService} from "../../../../services/cart/stripe.service";
import {PaymentService} from "../../../../services/cart/payment.service";

@Component({
  selector: 'app-cart-component',
  templateUrl: './cart-component.component.html',
  styleUrls: ['./cart-component.component.css']
})
export class CartComponentComponent {
  items: OrderLine[] = [];
  customerId: string = 'hhkjhgh';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private stripeService: StripeService,
    private paymentService :  PaymentService
  ) {
    this.items = this.cartService.getCart();
  }

  get total() {
    return this.cartService.getTotalAmount();
  }
  pay() {
    const orderId = this.generateOrderId(); // Génère ou récupère un ID de commande
    const amount = this.total;  // Total à payer (en DT)
    const quantity = this.items.length; // Nombre de produits dans le panier
    this.submitOrder();
    const payment = {
      orderId: orderId,
      amount: amount,
      paymentReference: "45546766",
      status:"SUCCESS"
    };
    this.paymentService.createPayment(payment).subscribe({
      next: (res) => {

         // 2. Enregistrer la commande
      },
      error: (err) => {
        console.error('❌ Erreur enregistrement paiement', err);
      }
    });
    // Appel à Stripe pour le paiement
    this.stripeService.checkout(orderId, amount, quantity).then(() => {
      // Si le paiement Stripe réussit, créer l'ordre et l'enregistrer



    }).catch(error => {
      console.error('Erreur lors du paiement avec Stripe:', error);
    });
  }

  generateOrderId(): number {
    return Math.floor(Math.random() * 100000); // Exemple simple, à adapter à ta logique
  }
  clearCart() {
    this.cartService.clearCart();
    this.items = [];
  }

  submitOrder(): void {
    const order: Order = {
      orderDate: new Date().toISOString().split('T')[0],
      status: 'PAID',
      totalAmount: this.total,
      customerId: this.customerId,
      orderLines: this.items
    };

    this.orderService.createOrder(order).subscribe({
      next: (res) => {
        alert('Commande créée avec succès ✅');
        this.clearCart();  // Vider le panier après la commande réussie
      },
      error: (err) => {
        console.error('Erreur création commande ❌', err);
      }
    });
  }

}
