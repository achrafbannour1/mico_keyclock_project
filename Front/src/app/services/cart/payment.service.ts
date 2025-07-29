import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = 'http://localhost:8030/payment/api/payment'; // Change le port si besoin

  constructor(private http: HttpClient) {}

  createPayment(payment: any) {
    return this.http.post(`${this.baseUrl}/create`, payment);
  }
  getAllPayments() {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }
  getAllOrders() {
    return this.http.get<any[]>('http://localhost:8030/commande/order/getAll'); // adapte l’URL si besoin
  }
}
