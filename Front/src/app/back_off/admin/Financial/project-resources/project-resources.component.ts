import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, AffectationDTO, Resource, Rtype } from '../../../../services/ResourceService/resource.service';

// Import SheetJS and FileSaver
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-project-resources',
  templateUrl: './project-resources.component.html',
  styleUrls: ['./project-resources.component.css']
})
export class ProjectResourcesComponent implements OnInit {
  projectName: string | null = null;
  projectResources: AffectationDTO[] = [];
  totalPrice: number = 0;
  isLoading: boolean = false;
  defaultImage: string = 'assets/images/default-car.jpg';

  // Static mapping of machine brands to price per hour
  private machinePricePerHour: { [key: string]: number } = {
    'excavator': 25,        // $25/hour
    'backhoe loader': 30,   // $30/hour
    'cement truck': 20,     // $20/hour
    'dozer': 35,            // $35/hour
    'bobcat': 28,           // $28/hour
    'tower': 40             // $40/hour (tower crane)
  };

  // Company information (you can fetch this from a service or API if needed)
  private companyName: string = 'T-Builders';
  private companyContact: string = 'Contact: (555) 123-4567 | Email: info@abcconstruction.com';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resourceService: ResourceService
  ) {}

  ngOnInit(): void {
    this.projectName = this.route.snapshot.paramMap.get('projectName');
    if (this.projectName) {
      this.fetchProjectResources(this.projectName);
    } else {
      this.router.navigate(['/admin/financial']);
    }
  }

  fetchProjectResources(projectName: string): void {
    this.isLoading = true;
    this.resourceService.getAllAffectations().subscribe({
      next: (affectations: AffectationDTO[]) => {
        console.log('Affectations:', affectations);
        this.projectResources = affectations.filter(
          (aff: AffectationDTO) => aff.projectName === projectName
        );
        console.log('Filtered Project Resources:', this.projectResources);
        this.totalPrice = 0;
        this.resourceService.getResources().subscribe({
          next: (resources: Resource[]) => {
            console.log('Resources:', resources);
            const pricePromises = this.projectResources.map((aff: AffectationDTO) => {
              return new Promise<void>((resolve) => {
                aff.pricePerUnit = aff.pricePerUnit ?? 0;
                aff.subtotal = aff.subtotal ?? 0;
                aff.rtype = aff.rtype ?? Rtype.MATERIALS;
                aff.imageUrl = aff.imageUrl ?? this.defaultImage;
                aff.pricePerHour = aff.pricePerHour ?? 0;

                const resource = resources.find(r => r.brande.toLowerCase() === aff.resourceBrand.toLowerCase());
                if (resource) {
                  aff.pricePerUnit = resource.price;
                  aff.rtype = resource.rtype;
                  aff.imageUrl = this.resourceService.getBrandImage(aff.resourceBrand);

                  if (resource.rtype === Rtype.MACHINE) {
                    const brandKey = aff.resourceBrand.toLowerCase();
                    aff.pricePerHour = this.machinePricePerHour[brandKey] ?? 0;
                    if (aff.pricePerHour === 0) {
                      console.log(`Machine Resource: ${aff.resourceBrand} has an unknown price per hour. Cost set to 0.`);
                      aff.subtotal = 0;
                    } else if (aff.workHours <= 0) {
                      console.log(`Machine Resource: ${aff.resourceBrand} has invalid work hours (${aff.workHours}). Cost set to 0.`);
                      aff.subtotal = 0;
                    } else {
                      const machineCost = aff.workHours * aff.pricePerHour;
                      aff.subtotal = machineCost;
                      this.totalPrice += machineCost;
                      console.log(`Machine Resource: ${aff.resourceBrand}, Type: ${aff.rtype}, Work Hours: ${aff.workHours}, Price per Hour: ${aff.pricePerHour}, Cost: ${machineCost}`);
                    }
                  } else {
                    aff.pricePerHour = 0;
                    const resourceCost = aff.quantity * aff.pricePerUnit;
                    aff.subtotal = resourceCost;
                    this.totalPrice += resourceCost;
                    console.log(`Non-Machine Resource: ${aff.resourceBrand}, Type: ${aff.rtype}, Quantity: ${aff.quantity}, Price per Unit: ${aff.pricePerUnit}, Cost: ${resourceCost}`);
                  }
                } else {
                  console.log(`Resource not found for brand: ${aff.resourceBrand}`);
                  aff.subtotal = 0;
                }
                resolve();
              });
            });
            Promise.all(pricePromises).then(() => {
              console.log('Final Project Resources:', this.projectResources);
              console.log('Total Price:', this.totalPrice);
              this.projectResources = [...this.projectResources];
              this.isLoading = false;
            });
          },
          error: (err: any) => {
            console.error('Error fetching resources for price calculation:', err);
            this.isLoading = false;
          }
        });
      },
      error: (err: any) => {
        console.error('Error fetching affectations:', err);
        this.isLoading = false;
        this.router.navigate(['/admin/financial']);
      }
    });
  }

  // Method to export the table data to XLSX
  exportToExcel(): void {
    if (!this.projectName) {
      console.error('Project name is not defined');
      return;
    }

    // Prepare the header rows with company information and project name
    const headerRows = [
      [this.companyName],
      [this.companyContact],
      [`Project: ${this.projectName}`],
      [], // Empty row for spacing
      ['Image URL', 'Resource Brand', 'Type', 'Quantity', 'Price per Unit', 'Total Hours of Work (Machines Only)', 'Price per Hour (Machines Only)', 'Subtotal']
    ];

    // Prepare the data rows
    const dataRows = this.projectResources.map(resource => {
      const isMachineResource = this.isMachine(resource);
      return [
        resource.imageUrl ?? this.defaultImage, // Include the image URL
        resource.rtype ? resource.resourceBrand : `${resource.resourceBrand} (Resource Not Found)`,
        resource.rtype ?? 'Unknown',
        resource.quantity,
        resource.pricePerUnit,
        isMachineResource ? (resource.workHours > 0 ? resource.workHours : 'N/A') : '-',
        isMachineResource ? (resource.pricePerHour > 0 ? resource.pricePerHour : 'Unknown Rate') : '-',
        resource.subtotal
      ];
    });

    // Add a row for the total price
    const footerRow = [
      '', '', '', '', '', '', 'Total Price:', this.totalPrice
    ];

    // Combine all rows
    const wsData = [...headerRows, ...dataRows, [], footerRow];

    // Create a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths for better readability
    ws['!cols'] = [
      { wch: 30 }, // Image URL
      { wch: 20 }, // Resource Brand
      { wch: 15 }, // Type
      { wch: 10 }, // Quantity
      { wch: 15 }, // Price per Unit
      { wch: 20 }, // Total Hours of Work
      { wch: 20 }, // Price per Hour
      { wch: 15 }  // Subtotal
    ];

    // Create a workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Project Resources');

    // Generate the Excel file and download it
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, `${this.projectName}_Resources.xlsx`);
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.defaultImage;
  }

  goBack(): void {
    this.router.navigate(['/admin/financial']);
  }

  isMachine(resource: AffectationDTO): boolean {
    const isMachine = resource.rtype === Rtype.MACHINE;
    console.log(`Checking if ${resource.resourceBrand} is a machine: ${isMachine}, Type: ${resource.rtype}`);
    return isMachine;
  }
}
