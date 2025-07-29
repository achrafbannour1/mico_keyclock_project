import { Injectable } from '@angular/core';

import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Order } from "../../models/order.model";
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'http://localhost:8030/commande/order'; // adapte selon ta config

  constructor(private http: HttpClient) {}

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, order);
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  getOrdersByCustomer(customerId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/customer/${customerId}`);
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/status/${id}?status=${status}`, {});
  }
}
