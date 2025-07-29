import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../../services/ProductService/ProductService';

@Component({
  selector: 'app-client-product-details',
  templateUrl: './client-product-details.component.html',
  styleUrls: ['./client-product-details.component.css']
})
export class ClientProductDetailsComponent implements OnInit {
  product: Product | null = null;
  errorMessage: string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    if (id && !isNaN(id)) {
      this.productService.getProductById(id).subscribe({
        next: (product) => {
          this.product = product;
          console.log('Client product details loaded:', product);
        },
        error: (err) => {
          console.error('Error loading product:', err);
          this.errorMessage = 'Failed to load product details.';
        }
      });
    } else {
      this.errorMessage = 'Invalid product ID';
      this.router.navigate(['/client/products']);
    }
  }

  getProductImage(image: string): string {
    return image && image.startsWith('http') ? image : 'assets/images/default-product.jpg';
  }

  goBack(): void {
    this.router.navigate(['/client/products']);
  }
}
