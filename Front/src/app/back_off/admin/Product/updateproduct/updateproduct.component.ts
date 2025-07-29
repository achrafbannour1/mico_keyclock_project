import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../../../services/ProductService/ProductService';

@Component({
  selector: 'app-updateproduct',
  templateUrl: './updateproduct.component.html',
  styleUrls: ['./updateproduct.component.css']
})
export class UpdateproductComponent implements OnInit {
  product: Product = {
    id: 0,
    designation: '',
    prix: 0,
    discount: 0,
    tauxRemise: 0,
    image: '',
    article: '',
    category: '',
    marque: ''
  };
  errorMessage: string = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (product) => {
          this.product = { ...product, id };
          console.log('Loaded product:', this.product);
        },
        error: (err) => {
          console.error('Error loading product:', err);
          this.errorMessage = 'Failed to load product: ' + (err.error?.message || err.message || 'Unknown error');
        }
      });
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (this.product.id === undefined) {
      this.errorMessage = 'Cannot update product: Invalid ID';
      return;
    }
    this.productService.updateProduct(this.product).subscribe({
      next: (response) => {
        console.log('Product updated:', response);
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error('Error updating product:', err);
        this.errorMessage = 'Failed to update product: ' + (err.error?.message || err.message || 'Unknown error');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/products']);
  }
}
