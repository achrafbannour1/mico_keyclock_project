import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demande } from '../models/demande.model';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  private baseUrl = 'http://localhost:8030/api/demandes'; // URL du backend Spring Boot

  constructor(private http: HttpClient) {}

  // 👉 Ajouter une nouvelle demande
  createDemande(demande: Demande): Observable<Demande> {
    return this.http.post<Demande>(this.baseUrl, demande);
  }

  getAllDemandes(): Observable<Demande[]> {
    return this.http.get<Demande[]>(this.baseUrl);
  }

  deleteDemande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateDemande(id: number, demande: Demande): Observable<Demande> {
    return this.http.put<Demande>(`${this.baseUrl}/${id}`, demande);
  }
  getDemandeStatsByType() {
    return this.http.get<{ [key: string]: number }>('http://localhost:8030/api/demandes');
  }

}
