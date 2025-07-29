import { Component, OnInit } from '@angular/core';
import { PaymentService } from "../../../../services/cart/payment.service";

@Component({
  selector: 'app-history-payement',
  templateUrl: './history-payement.component.html',
  styleUrls: ['./history-payement.component.css']
})
export class HistoryPayementComponent implements OnInit {
  payments: any[] = [];

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.getAllPayments();
  }

  getAllPayments(): void {
    this.paymentService.getAllPayments().subscribe({
      next: (res) => {
        this.payments = res;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des paiements", err);
      }
    });
  }
}
