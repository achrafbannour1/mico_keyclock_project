import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Livraison } from 'src/app/front_off/Model/livraison.model';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private apiUrl = 'http://localhost:8030/Livraison';

  constructor(private http: HttpClient) {}

  createLivraison(livraison: Livraison): Observable<Livraison> {
    return this.http.post<Livraison>(this.apiUrl, livraison).pipe(
      catchError((error) => {
        console.error('Erreur POST:', error);
        return throwError(() => new Error('Erreur lors de la création de la livraison'));
      })
    );
  }

  getAllLivraisons(): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Erreur GET:', error);
        return throwError(() => new Error('Erreur lors du chargement des livraisons'));
      })
    );
  }

  getLivraisonById(id: number): Observable<Livraison> {
    return this.http.get<Livraison>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Erreur GET by ID:', error);
        return throwError(() => new Error('Erreur lors de la récupération de la livraison'));
      })
    );
  }

  updateLivraison(id: number, livraison: Livraison): Observable<Livraison> {
    return this.http.put<Livraison>(`${this.apiUrl}/${id}`, livraison).pipe(
      catchError((error) => {
        console.error('Erreur PUT:', error);
        return throwError(() => new Error('Erreur lors de la mise à jour de la livraison'));
      })
    );
  }

  deleteLivraison(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Erreur DELETE:', error);
        return throwError(() => new Error('Erreur lors de la suppression de la livraison'));
      })
    );
  }
}
