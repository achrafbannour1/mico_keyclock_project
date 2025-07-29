import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit {
  posts: any[] = [];
  filteredPosts: any[] = [];
  searchTerm: string = '';
  notifications: string[] = [];
  unreadCount: number = 0;

  // ✅ Ajout pour le toast personnalisé
  showToast: boolean = false;
  toastMessage: string = '';

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    




    this.getPosts();
    
  }

  getPosts(): void {
    this.adminService.getAllPosts().subscribe(
      (posts: any[]) => {
        this.posts = posts;
        this.filteredPosts = posts;
      },
      error => {
        this.snackBar.open("Erreur lors du chargement des posts", "OK", { duration: 3000 });
      }
    );
  }

  deletePost(postId: number): void {
    if (confirm("Voulez-vous vraiment supprimer ce post ?")) {
      this.adminService.deletePost(postId).subscribe(
        () => {
          this.posts = this.posts.filter(post => post.id !== postId);
          this.filteredPosts = this.filteredPosts.filter(post => post.id !== postId);
          this.snackBar.open("Post supprimé avec succès", "OK", { duration: 3000 });
        },
        error => {
          this.snackBar.open("Erreur lors de la suppression", "OK", { duration: 3000 });
        }
      );
    }
  }

  viewPost(postId: number): void {
    this.router.navigate(['/admin/post', postId]);
  }

  goToStatistics(): void {
    this.router.navigate(['/admin/statistics']);
  }

  filterPosts(): void {
    this.filteredPosts = this.posts.filter(post => 
      post.id.toString().includes(this.searchTerm) || 
      post.content.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

 
}
