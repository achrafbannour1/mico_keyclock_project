import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../../services/ProductService/ProductService';

@Component({
  selector: 'app-post-to-blog-dialog',
  templateUrl: './post-to-blog-dialog.component.html'
})
export class PostToBlogDialogComponent {
  blogPostForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PostToBlogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { productId: number },
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {
    this.blogPostForm = this.fb.group({
      postedBy: ['', Validators.required]
    });
  }

 /* submit(): void {
    if (this.blogPostForm.valid) {
      const { postedBy } = this.blogPostForm.value;
      this.productService.postProductToBlog(this.data.productId, postedBy).subscribe({
        next: (response) => {
          this.snackBar.open(response, 'OK', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.open('Failed to post to blog: ' + (err.error?.message || err.message), 'OK', { duration: 3000 });
        }
      });
    }
  }*/

  cancel(): void {
    this.dialogRef.close();
  }
}
