import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/blogservice/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit, OnDestroy {
  postId: number;
  postData: any;

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private matSnackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.postId = Number(this.activatedRoute.snapshot.params['id']);
  }

  ngOnInit() {
    this.getPostById();
  }

  ngOnDestroy() {}

  getPostById() {
    this.postService.getPostById(this.postId).subscribe(
      res => {
        this.postData = res;
      },
      error => {
        this.matSnackBar.open("Something went wrong!", "OK", { duration: 3000 });
      }
    );
  }

  likePost() {
    if (!this.postData.likeCount) {
      this.postData.likeCount = 0;
    }
    this.postData.likeCount += 1;
  }
}
