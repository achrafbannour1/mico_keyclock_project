import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
// Ajoutez d'autres modules Angular Material selon vos besoins

@NgModule({
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    // Ajoutez ici d'autres modules si nécessaire
  ],
  exports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    // Exportez ici les modules que vous voulez utiliser dans toute l'application
  ]
})
export class AngularMaterialModule { }
