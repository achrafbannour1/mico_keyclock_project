import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASIC_URL = 'http://localhost:8030/api/blog/admin/';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private notificationSocket!: WebSocket; // Ajout de "!"

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${BASIC_URL}posts`);
  }

  getPostById(postId: number): Observable<any> {
    return this.http.get<any>(`${BASIC_URL}posts/${postId}`);
  }



  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${BASIC_URL}posts/${postId}`, { responseType: 'text' });
  }











}
