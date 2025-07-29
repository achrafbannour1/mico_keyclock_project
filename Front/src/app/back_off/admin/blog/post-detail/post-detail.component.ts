import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: any;
  postId: number;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {
    this.postId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getPostDetails();
  }

  getPostDetails(): void {
    this.adminService.getPostById(this.postId).subscribe(
      (data) => {
        this.post = data;
      },
      (error) => {
        this.snackBar.open("Erreur lors du chargement du post", "OK", { duration: 3000 });
      }
    );
  }
}
