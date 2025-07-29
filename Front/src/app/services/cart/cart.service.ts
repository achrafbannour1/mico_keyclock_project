import { Injectable } from '@angular/core';
import { OrderLine } from '../../models/order.model';

const CART_KEY = 'my-cart'; // nom de la clé dans localStorage

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: OrderLine[] = [];

  constructor() {
    this.loadCart(); // charger le panier au démarrage
  }

  private saveCart(): void {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items));
  }

  private loadCart(): void {
    const data = localStorage.getItem(CART_KEY);
    if (data) {
      this.items = JSON.parse(data);
    }
  }

  getCart(): OrderLine[] {
    return this.items;
  }

  addToCart(item: OrderLine): void {
    const existing = this.items.find(i => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.items.push({ ...item });
    }
    this.saveCart();
  }

  clearCart(): void {
    this.items = [];
    localStorage.removeItem(CART_KEY);
  }

  getTotalAmount(): number {
    return this.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  }

}
