import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LivraisonService } from 'src/app/services/livraison/livraison.service';
import { Livraison } from 'src/app/front_off/Model/livraison.model';
import * as bootstrap from 'bootstrap'; // Importation correcte

@Component({
  selector: 'app-livraison',
  templateUrl: './livraison.component.html',
  styleUrls: ['./livraison.component.css']
})
export class LivraisonComponent implements OnInit {
  livraisonForm: FormGroup;
  livraisons: Livraison[] = [];
  filteredLivraisons: Livraison[] = [];
  paginatedLivraisons: Livraison[] = [];
  showForm = false;
  isEditing = false;
  loading = false;
  searchTerm = '';
  sortKey = '';
  sortDirection = 1;
  selectedId: number | null = null;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(
    private fb: FormBuilder,
    private livraisonService: LivraisonService,
    private toastr: ToastrService
  ) {
    this.livraisonForm = this.fb.group({
      id: [null],
      orderId: ['', [Validators.required, Validators.min(1)]],
      adresse: ['', [Validators.required, Validators.minLength(3)]],
      transporteur: ['', [Validators.required, Validators.minLength(2)]],
      statut: ['EN_ATTENTE', Validators.required],
      dateLivraisonPrevue: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLivraisons();
  }

  loadLivraisons(): void {
    this.loading = true;
    this.livraisonService.getAllLivraisons().subscribe({
      next: (livraisons) => {
        this.livraisons = livraisons;
        this.filteredLivraisons = [...livraisons];
        this.updatePagination();
        console.log('Livraisons reçues:', livraisons);
        this.toastr.success('Livraisons chargées !');
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement:', err);
        this.toastr.error('Erreur lors du chargement des livraisons');
        this.loading = false;
      }
    });
  }

  openForm(livraison?: Livraison): void {
    if (livraison) {
      this.isEditing = true;
      this.livraisonForm.patchValue({
        ...livraison,
        dateLivraisonPrevue: new Date(livraison.dateLivraisonPrevue).toISOString().slice(0, 16)
      });
    } else {
      this.isEditing = false;
      this.resetForm();
    }
    this.showForm = true;
  }

  saveLivraison(): void {
    if (this.livraisonForm.invalid) return;

    this.loading = true;
    const livraison: Livraison = {
      ...this.livraisonForm.value,
      statut: this.livraisonForm.value.statut.toUpperCase()
    };

    if (this.isEditing && livraison.id) {
      this.livraisonService.updateLivraison(livraison.id, livraison).subscribe({
        next: () => {
          this.toastr.success('Livraison modifiée !');
          this.loadLivraisons();
          this.showForm = false;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur mise à jour:', err);
          this.toastr.error('Erreur lors de la modification');
          this.loading = false;
        }
      });
    } else {
      this.livraisonService.createLivraison(livraison).subscribe({
        next: () => {
          this.toastr.success('Livraison ajoutée !');
          this.loadLivraisons();
          this.showForm = false;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur ajout:', err);
          this.toastr.error('Erreur lors de l\'ajout');
          this.loading = false;
        }
      });
    }
  }

  openDeleteModal(id: number): void {
    this.selectedId = id;
    const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement); // Utilisation correcte
      modal.show();
    }
  }

  deleteLivraison(id: number): void {
    this.loading = true;
    this.livraisonService.deleteLivraison(id).subscribe({
      next: () => {
        this.toastr.success('Livraison supprimée !');
        this.loadLivraisons();
        this.loading = false;
        const modalElement = document.getElementById('deleteModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement); // Utilisation correcte
          modal?.hide();
        }
      },
      error: (err) => {
        console.error('Erreur suppression:', err);
        this.toastr.error('Erreur lors de la suppression');
        this.loading = false;
      }
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.livraisonForm.reset({
      orderId: '',
      adresse: '',
      transporteur: '',
      statut: 'EN_ATTENTE',
      dateLivraisonPrevue: ''
    });
  }

  filterLivraisons(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredLivraisons = this.livraisons.filter(
      (livraison) =>
        livraison.orderId.toString().includes(term) ||
        livraison.adresse.toLowerCase().includes(term) ||
        livraison.transporteur.toLowerCase().includes(term) ||
        livraison.statut.toLowerCase().includes(term)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  sort(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection *= -1;
    } else {
      this.sortKey = key;
      this.sortDirection = 1;
    }

    this.filteredLivraisons.sort((a, b) => {
      const valA = a[key as keyof Livraison];
      const valB = b[key as keyof Livraison];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortDirection * valA.localeCompare(valB);
      }
      return this.sortDirection * ((valA as number) - (valB as number));
    });
    this.updatePagination();
  }

  getSortIcon(key: string): string {
    if (this.sortKey !== key) return '';
    return this.sortDirection === 1 ? 'fa-sort-up' : 'fa-sort-down';
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredLivraisons.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedLivraisons = this.filteredLivraisons.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}