import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Project, Resource, ResourceService, Rtype } from "../../../../services/ResourceService/resource.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-affectresource',
  templateUrl: './affectresource.component.html',
  styleUrls: ['./affectresource.component.css']
})
export class AffectresourceComponent {
  machineForm!: FormGroup;
  resourceId!: number;
  resource!: Resource;
  errorMessage: string = '';
  isMachine: boolean = false;
  projects: Project[] = [];

  constructor(
    private route: ActivatedRoute,
    private resourceService: ResourceService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.resourceId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadResource();
    this.loadProjects();
  }

  loadResource(): void {
    this.resourceService.getResourceById(this.resourceId).subscribe({
      next: (data) => {
        this.resource = data;
        this.isMachine = this.resource.rtype === Rtype.MACHINE;
        this.initForm();
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
    if (this.isMachine) {
      this.machineForm = this.fb.group({
        projectId: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        workHours: ['', [Validators.required, Validators.min(1)]]
      });
    }
  }

  submitMachineAffectation(): void {
    if (this.machineForm.invalid) {
      this.errorMessage = "All fields must be filled correctly.";
      return;
    }

    if (!this.resource.status) {
      this.errorMessage = "This machine is not available for affectation.";
      return;
    }

    const formData = this.machineForm.value;
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (startDate >= endDate) {
      this.errorMessage = "Start date must be before the end date.";
      return;
    }

    this.errorMessage = '';

    this.resourceService.affectResourceToProject(this.resourceId, formData.projectId, formData)
      .subscribe({
        next: (updatedResource) => {
          this.resource = updatedResource;
          this.toastr.success('Machine successfully assigned to project!', 'Success');
          this.machineForm.reset();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error affecting resource.';
          console.error('Error affecting resource:', err);
          this.toastr.error(this.errorMessage, 'Error');
        }
      });
  }
}
