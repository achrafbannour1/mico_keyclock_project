import { Component } from '@angular/core';
import { ProductService, Product } from '../../../../services/ProductService/ProductService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css']
})
export class AddproductComponent {
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

  constructor(private productService: ProductService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage = '';
    const { id, ...productToSend } = this.product;
    console.log('Submitting product:', productToSend);
    this.productService.addProduct(productToSend).subscribe({
      next: (response) => {
        console.log('Product added successfully:', response);
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error('Error adding product:', err);
        this.errorMessage = err.status ?
          `Failed to add product: ${err.status} ${err.statusText} - ${err.error?.message || err.message || 'Unknown error'}` :
          'Failed to add product: Network error. Check CORS, backend logs, or network connectivity.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/products']);
  }
}
