import { Component } from '@angular/core';
import { AffectationDTO, ResourceService } from "../../../../services/ResourceService/resource.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-affectation-list',
  templateUrl: './affectation-list.component.html',
  styleUrls: ['./affectation-list.component.css']
})
export class AffectationListComponent {
  affectations: AffectationDTO[] = [];
  searchTerm: string = '';
  p: number = 1; // Current page for pagination
  itemsPerPage: number = 5; // Number of affectations per page

  constructor(
    private resourceService: ResourceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAffectations();
  }

  loadAffectations(): void {
    this.resourceService.getAllAffectations().subscribe(
      (data) => {
        this.affectations = data;
      },
      (error) => {
        this.toastr.error('Failed to load affectations.', 'Error');
      }
    );
  }

  deleteAffectation(id: number): void {
    this.resourceService.removeAffectation(id).subscribe(
      () => {
        this.affectations = this.affectations.filter(aff => aff.id !== id);
        this.toastr.success('Affectation deleted successfully!', 'Success');
      },
      (error) => {
        this.toastr.error('Error deleting affectation.', 'Error');
      }
    );
  }

  updateQuantity(affectation: AffectationDTO): void {
    this.resourceService.updateAffectationQuantity(affectation).subscribe(
      () => {
        this.toastr.success(`Quantity updated successfully for affectation ID ${affectation.id}!`, 'Success');
        this.loadAffectations(); // Refresh the list
      },
      (error) => {
        this.toastr.error('Error updating affectation quantity.', 'Error');
        this.loadAffectations(); // Refresh even on error to reset any invalid changes
      }
    );
  }

  onQuantityChange(affectation: AffectationDTO): void {
    if (affectation.quantity < 1) {
      affectation.quantity = 1; // Ensure quantity doesn’t go below 1
    }
  }

  onSearchChange(): void {
    this.p = 1; // Reset to first page on search
  }

  get filteredAffectations(): AffectationDTO[] {
    if (!this.searchTerm.trim()) {
      return this.affectations;
    }
    const searchLower = this.searchTerm.trim().toLowerCase();
    return this.affectations.filter(affectation =>
      (affectation.projectName?.toLowerCase().includes(searchLower) || '') ||
      (affectation.resourceBrand?.toLowerCase().includes(searchLower) || '')
    );
  }
}
