import { Component, OnInit } from '@angular/core';
import { Resource, ResourceService } from '../../../../services/ResourceService/resource.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-resourceadmindetails',
  templateUrl: './resourceadmindetails.component.html',
  styleUrls: ['./resourceadmindetails.component.css']
})
export class ResourceadmindetailsComponent implements OnInit {
  resource!: Resource;
  showUpdateForm = false;
  machineForm!: FormGroup;
  toolMaterialForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public resourceService: ResourceService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadResource();
  }

  loadResource(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.resourceService.getResourceById(id).subscribe({
        next: (data) => {
          this.resource = data;
          this.initForms();
        },
        error: (err) => {
          console.error('Error loading resource details:', err);
          this.toastr.error('Failed to load resource details.', 'Error');
        },
      });
    }
  }

  initForms(): void {
    this.machineForm = this.fb.group({
      plateNumber: [this.resource.plateNumber, Validators.required],
      price: [this.resource.price, [Validators.required, Validators.min(0)]],
      monthsPay: [this.resource.monthsPay, [Validators.required, Validators.min(0)]],
      nbWorkHours: [this.resource.nbWorkHours, [Validators.required, Validators.min(0)]]
    });

    this.toolMaterialForm = this.fb.group({
      price: [this.resource.price, [Validators.required, Validators.min(0)]],
      quantity: [this.resource.quantity, [Validators.required, Validators.min(0)]]
    });
  }

  openUpdateForm(): void {
    this.showUpdateForm = true;
  }

  updateResource(): void {
    if (this.resource.rtype === 'MACHINE' && this.machineForm.valid) {
      const updatedResource = { ...this.resource, ...this.machineForm.value };
      this.submitUpdate(updatedResource);
    } else if ((this.resource.rtype === 'TOOL' || this.resource.rtype === 'MATERIALS') && this.toolMaterialForm.valid) {
      const updatedResource = { ...this.resource, ...this.toolMaterialForm.value };
      this.submitUpdate(updatedResource);
    } else {
      this.toastr.error('Please fill in all required fields correctly.', 'Validation Error');
    }
  }

  submitUpdate(updatedResource: Resource): void {
    this.resourceService.updateResource(updatedResource).subscribe({
      next: () => {
        this.toastr.success('Resource updated successfully!', 'Success');
        this.showUpdateForm = false;
        this.loadResource();
      },
      error: (err) => {
        console.error('Error updating resource:', err);
        this.toastr.error('Failed to update resource.', 'Error');
      },
    });
  }

  deleteResource(): void {
    this.toastr.warning(
      'Click to confirm deletion of this resource.',
      'Confirm Delete',
      {
        timeOut: 5000,
        closeButton: true,
        tapToDismiss: true,
        positionClass: 'toast-center-center',
        onActivateTick: true
      }
    ).onTap.subscribe(() => {
      this.resourceService.removeResource(this.resource.id).subscribe({
        next: () => {
          this.toastr.success('Resource deleted successfully!', 'Success');
          this.router.navigate(['/admin/resource']);
        },
        error: (err) => {
          console.error('Error deleting resource:', err);
          this.toastr.error('Failed to delete resource.', 'Error');
        },
      });
    });
  }

  cancelUpdate(): void {
    this.showUpdateForm = false;
  }
}
