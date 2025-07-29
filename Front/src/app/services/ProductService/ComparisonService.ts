import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './ProductService';

@Injectable({
  providedIn: 'root'
})
export class ComparisonService {
  private comparisonSubject = new BehaviorSubject<Product[]>([]);
  comparison$ = this.comparisonSubject.asObservable();

  addToComparison(product: Product): boolean {
    const current = this.comparisonSubject.value;
    if (current.length >= 4) {
      return false;
    }
    if (!current.find(p => p.id === product.id)) {
      this.comparisonSubject.next([...current, product]);
      return true;
    }
    return false;
  }

  removeFromComparison(productId: number): void {
    const current = this.comparisonSubject.value;
    this.comparisonSubject.next(current.filter(p => p.id !== productId));
  }

  clearComparison(): void {
    this.comparisonSubject.next([]);
  }

  getComparisonCount(): number {
    return this.comparisonSubject.value.length;
  }
}
