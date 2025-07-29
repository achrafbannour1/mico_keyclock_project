import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
  private apiUrl = 'http://localhost:8089/financial';
  private paymentUrl = 'http://localhost:8089/payment';

  constructor(private http: HttpClient) {}

  addFinancial(projectId: number, financialData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add/${projectId}`, financialData);
  }

  getAllFinancials(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllFinancials`);
  }

  updateFinancial(id: number, financial: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, financial);
  }

  deleteFinancial(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/financial/delete/${id}`);
  }

  getPaymentsByFinancial(financialId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.paymentUrl}/financial/${financialId}/payments`);
  }

  updatePaymentStatus(paymentId: number, updateData: any): Observable<any> {
    return this.http.put(`${this.paymentUrl}/update/status/${paymentId}`, updateData);
  }

  updatePayment(paymentId: number, updatedPayment: any): Observable<any> {
    return this.http.put<any>(`${this.paymentUrl}/payment/update/${paymentId}`, updatedPayment); // Fixed endpoint
  }

  deletePayment(paymentId: number): Observable<void> {
    return this.http.delete<void>(`${this.paymentUrl}/deletePayment/${paymentId}`);
  }

  addPayment(payment: any, userId: number): Observable<any> {
    return this.http.post(`${this.paymentUrl}/create/user/${userId}`, payment);
  }

  addPaymentWithoutUser(payment: any): Observable<any> {
    return this.http.post(`${this.paymentUrl}/createPayment`, payment);
  }

  getAllProjects(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8089/project/getAllProjects');
  }

  getFinancialsByProjectId(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/project/${projectId}/financials`);
  }
  getAllPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.paymentUrl}/getAllPayments`);
  }
  createCheckoutSession(paymentId: number): Observable<any> {
    return this.http.post(`${this.paymentUrl}/create-checkout-session/${paymentId}`, {});
  }

  completePayment(paymentId: number): Observable<any> {
    return this.http.post(`${this.paymentUrl}/complete-payment/${paymentId}`, {});
  }
  getPaymentStatistics(): Observable<any> {
    return this.http.get<any>('http://localhost:8089/payment/statistics');
  }
  
}

