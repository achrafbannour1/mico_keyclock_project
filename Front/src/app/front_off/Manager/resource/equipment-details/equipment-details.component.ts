import { Component } from '@angular/core';
import { Maintenance, Resource, ResourceService } from "../../../../services/ResourceService/resource.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-equipment-details',
  templateUrl: './equipment-details.component.html',
  styleUrls: ['./equipment-details.component.css']
})
export class EquipmentDetailsComponent {
  resourceId!: number;
  maintenanceRecords: Maintenance[] = [];
  resource: Resource | null = null; // To store machine details
  totalCost: number = 0;
  totalWorkHours: number = 0; // To store total work hours
  showAddForm: boolean = false;
  lastWorkHours: number = 0;
  maintenanceForm!: FormGroup;
  maintenancePrediction: any = null;

  constructor(
    private route: ActivatedRoute,
    public resourceService: ResourceService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.resourceId = Number(this.route.snapshot.paramMap.get('id'));

    this.maintenanceForm = this.fb.group({
      mtype: ['', Validators.required],
      description: ['', Validators.required],
      cost: [0, [Validators.required, Validators.min(1)]],
      maintainDate: ['', Validators.required],
      nbWHMainatain: [0, [Validators.required, Validators.min(1)]]
    });

    // Fetch machine details
    this.resourceService.getResourceById(this.resourceId).subscribe(
      (resourceData) => {
        this.resource = resourceData;
      },
      (error) => {
        console.error('Error fetching resource details:', error);
      }
    );

    // Fetch maintenance records
    this.resourceService.getAllMaintenanceOfMachine(this.resourceId).subscribe(
      (data) => {
        this.maintenanceRecords = data;
        this.calculateTotalCost();
        this.calculateTotalWorkHours();
        this.setLastWorkHours();
      },
      (error) => {
        console.error('Error fetching maintenance records:', error);
      }
    );
    // Fetch maintenance prediction
    this.resourceService.predictNextMaintenance(this.resourceId).subscribe(
      (prediction) => {
        this.maintenancePrediction = prediction;
      },
      (error) => {
        console.error('Error fetching maintenance prediction:', error);
      }
    );
  }

  setLastWorkHours(): void {
    if (this.maintenanceRecords.length > 0) {
      const lastMaintenance = this.maintenanceRecords[this.maintenanceRecords.length - 1];
      this.lastWorkHours = lastMaintenance.nbWHMainatain;
    }
  }

  calculateTotalCost(): void {
    this.totalCost = this.maintenanceRecords.reduce((acc, maintenance) => acc + maintenance.cost, 0);
  }

  calculateTotalWorkHours(): void {
    this.totalWorkHours = this.maintenanceRecords.reduce((acc, maintenance) => acc + maintenance.nbWHMainatain, 0);
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  submitNewMaintenance(): void {
    if (this.maintenanceForm.valid) {
      this.resourceService.addMaintenance(this.resourceId, this.maintenanceForm.value).subscribe(
        (newMaintenance) => {
          this.resourceService.getAllMaintenanceOfMachine(this.resourceId).subscribe(
            (data) => {
              this.maintenanceRecords = data;
              this.calculateTotalCost();
              this.calculateTotalWorkHours();
              this.setLastWorkHours();
              this.maintenanceForm.reset();
              this.showAddForm = false;
              this.resourceService.predictNextMaintenance(this.resourceId).subscribe(
                (prediction) => {
                  this.maintenancePrediction = prediction;
                }
              );
            },
            (error) => {
              console.error('Error fetching updated maintenance records:', error);
            }
          );
        },
        (error) => {
          console.error('Error adding maintenance:', error);
        }
      );
    }
  }

  deleteMaintenance(id: number, index: number): void {
    this.resourceService.removeMaintenance(id).subscribe(
      () => {
        this.maintenanceRecords.splice(index, 1);
        this.calculateTotalCost();
        this.calculateTotalWorkHours();
        this.setLastWorkHours();
      },
      (error) => {
        console.error('Error deleting maintenance:', error);
      }
    );
  }

  exportToCSV(): void {
    if (!this.resource || this.maintenanceRecords.length === 0) {
      console.warn('No data available to export');
      return;
    }

    // CSV header
    const headers = ['Machine Brand', 'Plate Number', 'Maintenance Type', 'Description', 'Date', 'Cost', 'Work Hours'];
    const csvRows: string[] = [];

    // Add machine details and maintenance records
    this.maintenanceRecords.forEach(maintenance => {
      const row = [
        this.resource?.brande,
        this.resource?.plateNumber || 'N/A',
        maintenance.mtype,
        `"${maintenance.description.replace(/"/g, '""')}"`, // Escape quotes in description
        new Date(maintenance.maintainDate).toLocaleDateString(),
        maintenance.cost.toFixed(2),
        maintenance.nbWHMainatain
      ];
      csvRows.push(row.join(','));
    });

    // Add summary row
    csvRows.push(''); // Empty line
    csvRows.push(`Total Maintenance,${this.maintenanceRecords.length}`);
    csvRows.push(`Total Cost,${this.totalCost.toFixed(2)}`);
    csvRows.push(`Total Work Hours,${this.totalWorkHours}`);

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `maintenance_${this.resource.brande}_${this.resourceId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
