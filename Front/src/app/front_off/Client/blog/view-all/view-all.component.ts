import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PostService } from 'src/app/services/blogservice/post.service';

@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.css']
})
export class ViewAllComponent implements OnInit {
  
  allPosts: any[] = [];
  filteredPosts: any[] = [];
  page: number = 1;
  pageSize: number = 3;
  totalPages: number = 0;
  searchQuery: string = '';

  constructor(private postService: PostService, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit() {
    this.getAllPosts();
  }

  getAllPosts() {
    this.postService.getAllPosts().subscribe(res => {
      this.allPosts = res.map((post: any) => ({
        ...post,
        content: post.content || "" 
      }));
      this.filteredPosts = [...this.allPosts];
      this.calculateTotalPages();
    }, error => {
      this.snackBar.open("Something Went Wrong !!!!", "ok");
    });
  }

  filterPosts() {
    if (this.searchQuery) {
      this.filteredPosts = this.allPosts.filter(post =>
        post.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredPosts = [...this.allPosts];
    }
    this.calculateTotalPages();
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredPosts.length / this.pageSize);
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  deletePost(postId: number) {
    if (confirm("Voulez-vous vraiment supprimer cet article ?")) {
      this.postService.deletePost(postId).subscribe(
        (response: any) => { 
          if (response === "Post supprimé avec succès") {
            this.allPosts = this.allPosts.filter((post: any) => post.id !== postId);
            this.filteredPosts = this.filteredPosts.filter((post: any) => post.id !== postId);
            this.snackBar.open("Article supprimé avec succès", "OK", { duration: 3000 });
            this.calculateTotalPages();
          } else {
            this.snackBar.open("Erreur lors de la suppression", "OK", { duration: 3000 });
          }
        },
        error => {
          this.snackBar.open("Erreur lors de la suppression", "OK", { duration: 3000 });
        }
      );
    }
  }

  goToUsernamePage(): void {
    this.router.navigate(['/client/blog/chat']);
  }

  generateSummary(postId: number) {
    this.postService.getSummary(postId).subscribe(
      (summary: string) => {
        const post = this.allPosts.find(p => p.id === postId);
        if (post) {
          post.summary = summary;
          post.showSummary = true;
  
          setTimeout(() => {
            post.showSummary = false;
          }, 30000);
        }
      },
      error => {
        this.snackBar.open("Erreur lors de la génération du résumé", "OK", { duration: 3000 });
      }
    );
  }
}
