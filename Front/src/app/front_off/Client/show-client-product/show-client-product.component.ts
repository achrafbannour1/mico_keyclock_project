import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService, Product } from '../../../services/ProductService/ProductService';
import { Subscription } from 'rxjs';
import { CartService } from '../../../services/cart/cart.service';

@Component({
  selector: 'app-show-client-product',
  templateUrl: './show-client-product.component.html',
  styleUrls: ['./show-client-product.component.css']
})
export class ShowClientProductComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string | null = null;
  categories: string[] = [];
  errorMessage: string = '';
  showChatbot: boolean = false;
  selectedForComparison: Product[] = [];
  showComparison: boolean = false;
  selectedAttributes: string[] = ['image', 'prix', 'marque', 'category', 'discount', 'tauxRemise', 'article'];
  availableAttributes = [
    { key: 'image', label: 'Image' },
    { key: 'prix', label: 'Price' },
    { key: 'marque', label: 'Brand' },
    { key: 'category', label: 'Category' },
    { key: 'discount', label: 'Discount' },
    { key: 'tauxRemise', label: 'Remise' },
    { key: 'article', label: 'Article' }
  ];
  comparisonSummary: { cheapest?: Product; bestDiscount?: Product } = {};
  private subscription: Subscription = new Subscription();

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadComparisonFromStorage();
    this.subscription = this.productService.products$.subscribe({
      next: (products) => {
        this.products = products.filter(p => p.id !== undefined);
        this.filteredProducts = this.products;
        this.updateCategories();
        this.syncComparisonWithProducts();
        console.log('Client products loaded:', this.products);
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.errorMessage = 'Failed to load products. Please try again later.';
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.filteredProducts = this.selectedCategory
      ? this.products.filter(product => product.category === this.selectedCategory)
      : this.products;
  }

  isActiveCategory(category: string): boolean {
    return this.selectedCategory === category;
  }

  getProductImage(image: string): string {
    return image && image.startsWith('http') ? image : 'assets/images/default-product.jpg';
  }

  private updateCategories(): void {
    this.categories = [...new Set(this.products.map(product => product.category))];
    if (!this.selectedCategory && this.categories.length > 0) {
      this.selectedCategory = null;
    }
  }

  toggleChatbot(): void {
    this.showChatbot = !this.showChatbot;
  }

  addToCart(productId: number, quantity: number, unitPrice: number): void {
    this.cartService.addToCart({ productId, quantity, unitPrice });
    alert('Produit ajouté au panier ✅');
  }

  toggleComparison(product: Product): void {
    if (!product.id) {
      console.warn('Product ID is undefined:', product);
      return;
    }
    const index = this.selectedForComparison.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.selectedForComparison.splice(index, 1);
    } else if (this.selectedForComparison.length < 4) {
      this.selectedForComparison.push(product);
    } else {
      alert('You can compare up to 4 products at a time.');
    }
    this.showComparison = this.selectedForComparison.length > 1;
    this.updateComparisonSummary();
    this.saveComparisonToStorage();
  }

  removeFromComparison(productId: number): void {
    this.selectedForComparison = this.selectedForComparison.filter(p => p.id !== productId);
    this.showComparison = this.selectedForComparison.length > 1;
    this.updateComparisonSummary();
    this.saveComparisonToStorage();
  }

  isSelectedForComparison(product: Product): boolean {
    return product.id ? this.selectedForComparison.some(p => p.id === product.id) : false;
  }

  toggleAttribute(attribute: string): void {
    if (this.selectedAttributes.includes(attribute)) {
      this.selectedAttributes = this.selectedAttributes.filter(attr => attr !== attribute);
    } else {
      this.selectedAttributes.push(attribute);
    }
  }

  isBestValue(attribute: string, value: any, product: Product): boolean {
    if (this.selectedForComparison.length < 2) return false;
    if (attribute === 'prix') {
      return product.prix === Math.min(...this.selectedForComparison.map(p => p.prix));
    }
    if (attribute === 'discount') {
      return product.discount === Math.max(...this.selectedForComparison.map(p => p.discount));
    }
    if (attribute === 'tauxRemise') {
      return product.tauxRemise === Math.max(...this.selectedForComparison.map(p => p.tauxRemise));
    }
    return false;
  }

  private updateComparisonSummary(): void {
    if (this.selectedForComparison.length < 2) {
      this.comparisonSummary = {};
      return;
    }
    const cheapest = this.selectedForComparison.reduce((min, p) => p.prix < min.prix ? p : min);
    const bestDiscount = this.selectedForComparison.reduce((max, p) => p.discount > max.discount ? p : max);
    this.comparisonSummary = { cheapest, bestDiscount };
  }

  private saveComparisonToStorage(): void {
    const productIds = this.selectedForComparison.map(p => p.id!);
    localStorage.setItem('comparisonProducts', JSON.stringify(productIds));
  }

  private loadComparisonFromStorage(): void {
    const storedIds = localStorage.getItem('comparisonProducts');
    if (storedIds) {
      try {
        const productIds: number[] = JSON.parse(storedIds);
        if (Array.isArray(productIds) && productIds.every(id => typeof id === 'number')) {
          this.productService.compareProducts(productIds).subscribe({
            next: (products) => {
              this.selectedForComparison = products;
              this.showComparison = this.selectedForComparison.length > 1;
              this.updateComparisonSummary();
            },
            error: (err) => console.error('Error loading comparison products:', err)
          });
        } else {
          console.warn('Invalid product IDs in localStorage:', storedIds);
        }
      } catch (e) {
        console.error('Error parsing comparison products from localStorage:', e);
      }
    }
  }

  private syncComparisonWithProducts(): void {
    const validIds = new Set(this.products.map(p => p.id));
    this.selectedForComparison = this.selectedForComparison.filter(p => p.id && validIds.has(p.id));
    this.showComparison = this.selectedForComparison.length > 1;
    this.updateComparisonSummary();
    this.saveComparisonToStorage();
  }
}
