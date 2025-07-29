import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Project, ResourceService } from "../../../../services/ResourceService/resource.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-affect-tool-material',
  templateUrl: './affect-tool-material.component.html',
  styleUrls: ['./affect-tool-material.component.css']
})
export class AffectToolMaterialComponent {
  toolMaterialForm!: FormGroup;
  resourceId!: number;
  resource: any;
  errorMessage: string = '';
  projects: Project[] = [];

  constructor(
    private route: ActivatedRoute,
    private resourceService: ResourceService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.resourceId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.loadResource();
    this.loadProjects();
  }

  loadResource(): void {
    this.resourceService.getResourceById(this.resourceId).subscribe({
      next: (data) => {
        this.resource = data;
      },
      error: (err) => {
        console.error('Error loading resource:', err);
        this.toastr.error('Failed to load resource.', 'Error');
      }
    });
  }

  loadProjects(): void {
    this.resourceService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.toastr.error('Failed to load projects.', 'Error');
      }
    });
  }

  initForm(): void {
    this.toolMaterialForm = this.fb.group({
      projectId: [null, Validators.required],
      quantity: [null, [Validators.required, Validators.min(1)]]
    });
  }

  submitAffectation(): void {
    this.toolMaterialForm.markAllAsTouched();
    console.log('Form valid:', this.toolMaterialForm.valid);
    console.log('Form value:', this.toolMaterialForm.value);

    if (this.toolMaterialForm.invalid) {
      this.errorMessage = 'All fields must be filled correctly.';
      return;
    }

    const formData = this.toolMaterialForm.value;

    if (formData.quantity > this.resource.quantity) {
      this.errorMessage = 'Requested quantity exceeds available quantity.';
      return;
    }

    this.resourceService.affectResourceToProject(this.resourceId, formData.projectId, formData)
      .subscribe({
        next: (updatedResource) => {
          this.resource = updatedResource;
          this.toastr.success('Resource successfully assigned to project!', 'Success');
          this.toolMaterialForm.reset();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error affecting resource.';
          console.error('Error affecting resource:', err);
          this.toastr.error(this.errorMessage, 'Error');
        }
      });
  }
}
