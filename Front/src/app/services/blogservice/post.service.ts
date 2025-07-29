import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const BASIC_URL = 'http://localhost:8030/'
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient) { }

  createNewPost(data: any): Observable<any> {
    console.log("Requête envoyée au backend :", data); // Vérifier les données envoyées
    return this.http.post(BASIC_URL + 'api/blog/posts', data);
  }
  updatePost(postId: number, postData: any): Observable<any> {
    return this.http.put(`http://localhost:8030/api/blog/posts/${postId}`, postData)

  }
  deletePost(postId: number) {
    return this.http.delete(`http://localhost:8030/api/blog/posts/${postId}`, { responseType: 'text' });
  }





  getAllPosts():Observable<any>{
    return this.http.get(BASIC_URL +'api/blog/posts');
  }

  getPostById(postId: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/blog/posts/${postId}`);
  }

  likePost(postId: number): Observable<any> {
    return this.http.put(BASIC_URL+`api/blog/posts/${postId}/like`,{});
  }

  searchByName(name:string):Observable<any>{
    return this.http.get(BASIC_URL+ `api/blog/posts/search/${name}`);
  }
  getSummary(postId: number): Observable<string> {
    return this.http.get(BASIC_URL + `api/blog/posts/${postId}/summary`, { responseType: 'text' });
  }








}
