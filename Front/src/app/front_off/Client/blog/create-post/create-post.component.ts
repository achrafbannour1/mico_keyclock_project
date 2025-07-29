import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/blogservice/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {

  postForm!: FormGroup;
  tags: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private postService: PostService,
  ) {}

  ngOnInit() {
    this.postForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      content: [null, [Validators.required, Validators.maxLength(5000)]],
      img: [null, Validators.required]
    });
  }

  add(event: any) {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
  }

  remove(tag: any) {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  createPost() {
    if (this.postForm.invalid) {
      this.snackBar.open("Please fill all required fields correctly.", "OK", { duration: 3000 });
      return;
    }

    const data = this.postForm.value;
    data.tags = this.tags;

    this.postService.createNewPost(data).subscribe(
      () => {
        this.snackBar.open("Post Created Successfully!", "OK", { duration: 3000 });
        this.router.navigateByUrl("/client/blog/view-all");
      },
      (error: any) => {
        if (error.status === 400) {
          this.snackBar.open(error.error, "OK", { duration: 3000 });
        } else {
          this.snackBar.open("Something Went Wrong!", "OK", { duration: 3000 });
        }
      }
    );
  }
}
