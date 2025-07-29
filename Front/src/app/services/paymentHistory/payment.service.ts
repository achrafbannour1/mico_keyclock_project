import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = 'http://localhost:8089/payment';

  constructor(private http: HttpClient) {}

  getPaymentsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/history/user/${userId}`);
  }
  createPayment(payment: any, userId: number): Observable<any> {
    return this.http.post(`http://localhost:8089/payment/create/user/${userId}`, payment);
  }
  
  getAllPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getAllPayments`);
  }

  

  updatePaymentStatus(paymentId: number, updateData: any): Observable<any> {
    return this.http.put(`http://localhost:8089/payment/update/status/${paymentId}`, updateData);
  }
  
  getPayments(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8089/payment/all');
  }
  getPaymentsByFinancial(financialId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/financial/${financialId}/payments`);
  }
  calculateLateInterest(paymentId: number, annualRate: number): Observable<any> {
    if (!paymentId || !annualRate) {
      throw new Error("Payment ID et Annual Rate sont requis !");
    }
    
    const url = `${this.baseUrl}/calculate-late-interest/${paymentId}?annualRate=${annualRate}`;
    return this.http.post(url, {}); // Renvoie un Observable
  }

 getExchangeRates(): Observable<any> {
  const apiUrl = `https://api.exchangerate-api.com/v4/latest/EUR`; // API de taux de change
  return this.http.get<any>(apiUrl);
}

  
 
}


