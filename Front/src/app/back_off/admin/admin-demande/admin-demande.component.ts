import { Component, OnInit } from '@angular/core';
import { DemandeService } from 'src/app/services/demande.service';
import { Demande } from 'src/app/models/demande.model';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-admin-demande',
  templateUrl: './admin-demande.component.html',
  styleUrls: ['./admin-demande.component.css']
})
export class AdminDemandeComponent implements OnInit {
  demandes: Demande[] = [];
  chart: any;


  constructor(private demandeService: DemandeService) {}

  ngOnInit(): void {
    this.loadDemandes();
  }

  loadDemandes(): void {
    this.demandeService.getAllDemandes().subscribe({
      next: (data) => {
        this.demandes = data;
      },
      error: (err) => {
        console.error('Erreur de chargement des demandes', err);
      }
    });
  }
  enderChart(labels: string[], data: number[]) {
    if (this.chart) {
      this.chart.destroy(); // Pour éviter les duplications
    }

    this.chart = new Chart('demandeChart', {
      type: 'bar', // Tu peux aussi mettre 'pie', 'doughnut', etc.
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre de demandes par type',
          data: data,
          backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#E91E63'],
          borderColor: ['#388E3C', '#1976D2', '#FFA000', '#C2185B'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: 'Statistiques des demandes par type'
          }
        }
      }
    });
  }
}
