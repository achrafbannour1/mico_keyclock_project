import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemandeService } from 'src/app/services/demande.service'; // Chemin corrigé
import { Demande } from 'src/app/models/demande.model'; // Supprime l'extension .ts ici

@Component({
  selector: 'app-demande',
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.css']
})
export class DemandeComponent {
  demandeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private demandeService: DemandeService
  ) {
    this.demandeForm = this.fb.group({
      typeDemande: ['', Validators.required],
      description: ['', Validators.required],
      date_demande: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.demandeForm.valid) {
      const formValues = this.demandeForm.value;
      const nouvelleDemande = new Demande(
        formValues.typeDemande,
        formValues.description,
        formValues.date_demande
      );

      this.demandeService.createDemande(nouvelleDemande).subscribe({
        next: (data: any) => {
          console.log('Demande créée avec succès', data);
          this.demandeForm.reset();
        },
        error: (err: any) => {
          console.error('Erreur lors de la création de la demande', err);
        }
      });
    }
  }
}
