import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class FinancialService {
  private baseUrl = 'http://localhost:8089/financial';
  constructor(private http: HttpClient) { }
  getFinancialAmountByProject(projectId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/amount/project/${projectId}`);
  }



  getFinancials(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getAllFinancials`);
  }
  generateInvoice(paymentId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/payment/generateInvoice/${paymentId}`, { responseType: 'blob' });
  }
  
  getExchangeRates(): Observable<any> {
    const apiUrl = `https://api.exchangerate-api.com/v4/latest/EUR`; // EUR comme base
    return this.http.get<any>(apiUrl);
  }
  getQuotesByProject(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/quotes/project/${projectId}`);
  }
}



