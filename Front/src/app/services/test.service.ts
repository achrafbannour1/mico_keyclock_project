import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the structure of a Bloc
export interface Bloc {
  idBloc: number;
  nomBloc: string;
  capaciteBloc: number;
  createDate: string;
  lastModified: string;
  user: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlocService {

  // URL of your Spring Boot API endpoint
  private apiUrl = 'http://localhost:8089/bloc/retrieve-all-bloc';  // Update with your correct backend URL

  constructor(private http: HttpClient) { }

  // Method to get all blocs
  getAllBlocs(): Observable<Bloc[]> {
    return this.http.get<Bloc[]>(this.apiUrl);
  }
}
