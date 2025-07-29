import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ResourceService, Rtype } from "../../../../services/ResourceService/resource.service";
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-addresource',
  templateUrl: './addresource.component.html',
  styleUrls: ['./addresource.component.css']
})
export class AddresourceComponent implements OnInit {
  machineForm!: FormGroup;
  toolForm!: FormGroup;
  selectedForm: string = '';
  machineBrands: string[] = ['Backhoe Loader', 'Excavator', 'cement truck', 'Dozer', 'bobcat', 'tower'];
  toolBrands: string[] = ['Bucket', 'Drill', 'Hammer', 'Level', 'Meter', 'Trowel'];
  materialBrands: string[] = ['Steel', 'bricks', 'concrete', 'concrete stones', 'sand'];

  constructor(
    private fb: FormBuilder,
    public resourceService: ResourceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  initializeForms(): void {
    this.machineForm = this.fb.group({
      plateNumber: ['', [Validators.required], [this.plateNumberValidator()]],
      brande: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      nbWorkHours: [null, [Validators.required, Validators.min(1)]],
      monthsPay: [null, [Validators.required, Validators.min(1)]]
    });

    this.toolForm = this.fb.group({
      type: ['TOOL', Validators.required],
      brande: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      quantity: [null, [Validators.required, Validators.min(1)]]
    });
  }

  // Async validator for plate number uniqueness
  plateNumberValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return of(control.value).pipe(
        debounceTime(300),
        switchMap(value => this.resourceService.checkPlateNumberExists(value)),
        map(exists => (exists ? { plateNumberExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  showForm(formType: string): void {
    this.selectedForm = formType;
  }

  onSubmitMachine(): void {
    if (this.machineForm.valid) {
      const formData = { ...this.machineForm.value, rtype: 'MACHINE' };
      console.log("Sending Machine Data:", formData);
      this.resourceService.addResource(formData).subscribe({
        next: (response) => {
          this.toastr.success('Machine added successfully!', 'Success');
          this.machineForm.reset();
          this.selectedForm = '';
        },
        error: (error) => {
          console.error("Error adding machine:", error);
          const message = error.error || 'Failed to add machine.';
          this.toastr.error(message, 'Error');
        }
      });
    }
  }

  onSubmitTool(): void {
    if (this.toolForm.valid) {
      const formData = { ...this.toolForm.value, rtype: this.toolForm.value.type };
      console.log("Sending Tool/Material Data:", formData);
      this.resourceService.addResource(formData).subscribe({
        next: (response) => {
          this.toastr.success('Tool/Material added successfully!', 'Success');
          this.toolForm.reset();
          this.selectedForm = '';
        },
        error: (error) => {
          console.error("Error adding tool/material:", error);
          const message = error.error || 'Failed to add tool/material.';
          this.toastr.error(message, 'Error');
        }
      });
    }
  }

  // Helper function to check field errors
  isInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control?.invalid && (control?.touched || control?.dirty));
  }

  // Helper to get plate number error message
  getPlateNumberError(): string {
    const control = this.machineForm.get('plateNumber');
    if (control?.errors?.['required']) {
      return 'Plate number is required.';
    }
    if (control?.errors?.['plateNumberExists']) {
      return 'This plate number already exists.';
    }
    return '';
  }
}
