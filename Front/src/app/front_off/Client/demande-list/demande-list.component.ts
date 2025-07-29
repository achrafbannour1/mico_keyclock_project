import { Component, OnInit } from '@angular/core';

import { DemandeService } from 'src/app/services/demande.service';
import { Demande } from 'src/app/models/demande.model';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-demande-list',
  templateUrl: './demande-list.component.html',
  styleUrls: ['./demande-list.component.css']
})
export class DemandeListComponent implements OnInit {
  demandes: Demande[] = [];
  selectedDemande: Demande | null = null;

  constructor(
    private demandeService: DemandeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDemandes();

  }

  loadDemandes(): void {
    this.demandeService.getAllDemandes().subscribe(
      (data) => {
        this.demandes = data;
        console.log(data)
      },
      (error) => {
        console.error('Erreur lors du chargement des demandes', error);
      }
    );
  }
  deleteDemande(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      this.demandeService.deleteDemande(id).subscribe(
        () => {
          console.log(`Demande ${id} supprimée`);
          // Recharge la liste après suppression
          this.loadDemandes();
        },
        (error) => {
          console.error('Erreur lors de la suppression de la demande', error);
        }
      );
    }
  }

  // Ouvrir le modal pour modifier une demande
  openModal(demande: Demande): void {
    this.selectedDemande = { ...demande }; // Copier les données de la demande dans selectedDemande

    const modalElement = document.getElementById('demandeModal');
    if (modalElement) {
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error('Modal element not found');
    }
  }

  updateDemande(): void {
    if (this.selectedDemande && this.selectedDemande.id) {
      this.demandeService.updateDemande(this.selectedDemande.id, this.selectedDemande).subscribe(
        (updatedDemande) => {
          console.log('Demande mise à jour', updatedDemande);
          this.loadDemandes();
          const modalElement = document.getElementById('demandeModal');
          if (modalElement) {
            const modal = window.bootstrap.Modal.getInstance(modalElement);
            if (modal) {
              modal.hide();
            }
          }
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de la demande', error);
        }
      );
    }
  }
}
