import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../../services/cart/payment.service'; // adapte le chemin si besoin

@Component({
  selector: 'app-history-order',
  templateUrl: './history-order.component.html',
  styleUrls: ['./history-order.component.css']
})
export class HistoryOrderComponent implements OnInit {
  orders: any[] = [];

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.paymentService.getAllOrders().subscribe({
      next: (res) => {
        this.orders = res;
      },
      error: (err) => {
        console.error('❌ Erreur chargement des commandes', err);
      }
    });
  }
}
