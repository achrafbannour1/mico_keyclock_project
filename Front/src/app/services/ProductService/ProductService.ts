import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Product {
  id?: number;
  designation: string;
  prix: number;
  discount: number;
  tauxRemise: number;
  image: string;
  article: string;
  category: string;
  marque: string;
  createdBy?: string;
  lastModifiedBy?: string;
  createdDate?: string;
  lastModifiedDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8030/product';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialProducts();
  }

  private loadInitialProducts(): void {
    console.log('Loading initial products from:', this.apiUrl);
    this.getProducts().subscribe({
      next: (products) => {
        console.log('Products received:', products);
        this.productsSubject.next(products);
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.productsSubject.next([]);
      }
    });
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap(products => console.log('HTTP GET response:', products))
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: Product): Observable<Product> {
    console.log('Sending POST to:', this.apiUrl, 'with payload:', product);
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap(() => this.refreshProducts())
    );
  }

  updateProduct(product: Product): Observable<Product> {
    console.log('Sending PUT to:', `${this.apiUrl}/${product.id}`, 'with payload:', product);
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product).pipe(
      tap(() => this.refreshProducts())
    );
  }

  deleteProduct(id: number): Observable<void> {
    console.log('Sending DELETE to:', `${this.apiUrl}/${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refreshProducts())
    );
  }

  compareProducts(productIds: number[]): Observable<Product[]> {
    console.log('Sending POST to:', `${this.apiUrl}/compare`, 'with payload:', { productIds });
    return this.http.post<Product[]>(`${this.apiUrl}/compare`, { productIds });
  }

  postTweet(title: string, imageUrl: string): Observable<string> {
    const tweetData = { title, imageUrl };
    console.log('Sending POST to:', `${this.apiUrl}/publish-product`, 'with payload:', tweetData);
    return this.http.post(`${this.apiUrl}/publish-product`, tweetData, { responseType: 'text' });
  }

  private refreshProducts(): void {
    this.getProducts().subscribe({
      next: (products) => this.productsSubject.next(products),
      error: (err) => console.error('Error refreshing products:', err)}
    );
  }

  postProductToBlog(productId: number, postedBy: string): Observable<string> {
    const data = { postedBy };
    console.log('Sending POST to:', `${this.apiUrl}/publish-to-blog/${productId}`, 'with payload:', data);
    return this.http.post(`${this.apiUrl}/publish-to-blog/${productId}`, data, { responseType: 'text' });
  }
  }
