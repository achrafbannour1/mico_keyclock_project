import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, AffectationDTO, Resource, Rtype } from '../../../../services/ResourceService/resource.service';

@Component({
  selector: 'app-project-resources-client',
  templateUrl: './project-resources-client.component.html',
  styleUrls: ['./project-resources-client.component.css']
})
export class ProjectResourcesClientComponent implements OnInit {
  projectName: string | null = null;
  projectResources: AffectationDTO[] = [];
  totalPrice: number = 0;
  isLoading: boolean = false;
  defaultImage: string = 'assets/images/default-car.jpg';

  private machinePricePerHour: { [key: string]: number } = {
    'excavator': 25,
    'backhoe loader': 30,
    'cement truck': 20,
    'dozer': 35,
    'bobcat': 28,
    'tower': 40
  };

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
      this.router.navigate(['/client/project']);
    }
  }

  fetchProjectResources(projectName: string): void {
    this.isLoading = true;
    this.resourceService.getAllAffectations().subscribe({
      next: (affectations: AffectationDTO[]) => {
        this.projectResources = affectations.filter(
          (aff: AffectationDTO) => aff.projectName === projectName
        );
        this.totalPrice = 0;
        this.resourceService.getResources().subscribe({
          next: (resources: Resource[]) => {
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
                    if (aff.pricePerHour === 0 || aff.workHours <= 0) {
                      aff.subtotal = 0;
                    } else {
                      const machineCost = aff.workHours * aff.pricePerHour;
                      aff.subtotal = machineCost;
                      this.totalPrice += machineCost;
                    }
                  } else {
                    aff.pricePerHour = 0;
                    const resourceCost = aff.quantity * aff.pricePerUnit;
                    aff.subtotal = resourceCost;
                    this.totalPrice += resourceCost;
                  }
                } else {
                  aff.subtotal = 0;
                }
                resolve();
              });
            });
            Promise.all(pricePromises).then(() => {
              this.projectResources = [...this.projectResources];
              this.isLoading = false;
            });
          },
          error: (err: any) => {
            console.error('Error fetching resources:', err);
            this.isLoading = false;
          }
        });
      },
      error: (err: any) => {
        console.error('Error fetching affectations:', err);
        this.isLoading = false;
        this.router.navigate(['/client/project']);
      }
    });
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.defaultImage;
  }

  goBack(): void {
    this.router.navigate(['/client/project']);
  }

  isMachine(resource: AffectationDTO): boolean {
    return resource.rtype === Rtype.MACHINE;
  }
}
