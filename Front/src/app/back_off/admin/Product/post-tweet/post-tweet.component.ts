import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-tweet',
  templateUrl: './post-tweet.component.html',
  styleUrls: ['./post-tweet.component.css']
})
export class PostTweetComponent implements OnInit {
  tweetForm: FormGroup;
  isSubmitting = false;
  tweetResponse: string | null = null;
  tweetSuccess = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.tweetForm = this.fb.group({
      content: ['', Validators.required],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.tweetForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const tweetData = {
      title: this.tweetForm.get('content')?.value,
      imageUrl: this.tweetForm.get('imageUrl')?.value
    };

    this.http.post('http://localhost:8030/product/publish-product', tweetData, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.tweetResponse = response;
          this.tweetSuccess = true;
          this.toastr.success('Tweet posted successfully!', 'Success');
          setTimeout(() => this.router.navigate(['/admin/products']), 2000);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.tweetResponse = err.error || 'Error posting tweet';
          this.tweetSuccess = false;
          this.toastr.error(this.tweetResponse, 'Error');
        }
      });
  }
}
