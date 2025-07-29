import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/services/blogservice/post.service';


@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  editForm!: FormGroup;  // Correction : Déclaration correcte
  postId!: number;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute,
    public router: Router  // Correction : Déclarer `router` comme `public`
  ) {}

  ngOnInit() {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));

    this.editForm = this.fb.group({
      name: [''],
      content: [''],
      postedBy: [''],
      img: ['']
    });

    this.loadPostData();
  }

  loadPostData() {
    this.postService.getPostById(this.postId).subscribe(post => {
      this.editForm.patchValue(post);
    });
  }

  updatePost() {  // Correction : La méthode existe bien maintenant
    if (this.editForm.valid) {
      this.postService.updatePost(this.postId, this.editForm.value).subscribe(() => {
        this.router.navigate(['/client/blog/view-all']); // Redirection après mise à jour
      });
    }
  }
}
