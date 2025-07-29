import { Component, OnInit } from '@angular/core';
import { FinancialService } from '../financial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartType } from 'chart.js';

import { ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-project-financials',
  templateUrl: './project-financials.component.html',
  styleUrls: ['./project-financials.component.css']
})
export class ProjectFinancialsComponent implements OnInit {
  @ViewChild('pieChart') pieChartRef!: ElementRef;
  pieChart: any;
  projectId: number;
  projectName: string = '';
  financials: any[] = [];
  selectedFinancialToEdit: any = null;
  financialTypes = ['PROJECT_PAYMENT', 'EMPLOYEE_PAYMENT'];
  selectedFinancialForPayment: any = null;
  newPayment = {
    paymentAmount: 0,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentStatus: 'PENDING',
    paymentMethod: 'CARD',
    financialId: 0
  };
  paymentStatuses = ['COMPLETED', 'PENDING', 'FAILED'];
  paymentMethods = ['CARD', 'CASH', 'BANK_TRANSFER'];
  searchQuery: string = '';
  paymentStats: any = {
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0,
    totalPaid: 0,
    totalPending: 0,
    completionRate: 0
  };


  constructor(
    private financialService: FinancialService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.projectId = +this.route.snapshot.paramMap.get('projectId')!;
  }

  ngOnInit(): void {
    this.fetchProjectName();
    this.fetchFinancials();
    this.fetchPaymentStatistics();
  }





  fetchPaymentStatistics(): void {
    this.financialService.getPaymentStatistics().subscribe({
      next: (stats) => {
        this.paymentStats = stats;
        this.createPieChart(); // 🟢 Créer le Pie Chart après avoir récupéré les données
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des statistiques de paiement:', error);
      }
    });
  }

  createPieChart(): void {
    if (this.pieChart) {
      this.pieChart.destroy(); // 🔄 Détruire le graphique existant pour éviter les doublons
    }

    this.pieChart = new Chart(this.pieChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Completed', 'Pending'],
        datasets: [{
          data: [
            this.paymentStats.completedPayments,
            this.paymentStats.pendingPayments,

          ],
          backgroundColor: ['#ff6409', ' rgba(255, 100, 9, 0.3)', ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  fetchProjectName(): void {
    this.financialService.getAllProjects().subscribe({
      next: (projects) => {
        const project = projects.find((p: any) => p.id === this.projectId);
        this.projectName = project ? project.name : 'Unknown Project';
        console.log('Project name:', this.projectName);
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
        this.projectName = 'Unknown Project';
      }
    });
  }

  fetchFinancials(): void {
    this.financialService.getFinancialsByProjectId(this.projectId).subscribe({
      next: (data) => {
        this.financials = data.map((financial: any) => ({
          ...financial,
          transactionDate: financial.transactionDate ? new Date(financial.transactionDate).toLocaleDateString() : 'N/A'
        }));
        console.log('Financials for project', this.projectId, ':', this.financials);
      },
      error: (error) => {
        console.error('Error fetching financials:', error);
        this.financials = [];
      }
    });
  }

  onEditFinancial(financial: any): void {
    this.selectedFinancialToEdit = { ...financial };
    this.selectedFinancialToEdit.transactionDate = this.formatDateForInput(this.selectedFinancialToEdit.transactionDate);
  }

  updateFinancial(): void {
    if (!this.selectedFinancialToEdit || !this.selectedFinancialToEdit.id) {
      alert('No financial selected!');
      return;
    }
    this.financialService.updateFinancial(this.selectedFinancialToEdit.id, this.selectedFinancialToEdit).subscribe({
      next: () => {
        alert('Financial updated successfully!');
        this.selectedFinancialToEdit = null;
        this.fetchFinancials();
      },
      error: (error) => {
        console.error('Error updating financial:', error);
        alert('Failed to update financial!');
      }
    });
  }

  deleteFinancial(financialId: number): void {
    if (!confirm('Are you sure you want to delete this financial?')) {
      return;
    }
    this.financialService.deleteFinancial(financialId).subscribe({
      next: (response) => {
        console.log('Delete response:', response);
        alert('Financial deleted successfully!');
        this.fetchFinancials();
      },
      error: (error) => {
        console.error('Error deleting financial:', error);
        alert('Failed to delete financial: ' + (error.message || 'Unknown error'));
      },
      complete: () => {
        console.log('Delete request completed');
      }
    });
  }

  showPayments(financialId: number): void {
    this.router.navigate(['/admin/financial-payments', financialId]);
  }

  addPayment(financial: any): void {
    this.selectedFinancialForPayment = financial;
    this.newPayment.financialId = financial.id;
  }

  cancelAddPayment(): void {
    this.selectedFinancialForPayment = null;
    this.newPayment = {
      paymentAmount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'PENDING',
      paymentMethod: 'CARD',
      financialId: 0
    };
  }

  submitPayment(): void {
    if (!this.newPayment.paymentAmount || this.newPayment.paymentAmount <= 0) {
      alert('Please enter a valid payment amount!');
      return;
    }
    // Structure the payload with financial object
    const paymentPayload = {
      paymentAmount: this.newPayment.paymentAmount,
      paymentDate: this.newPayment.paymentDate,
      paymentStatus: this.newPayment.paymentStatus,
      paymentMethod: this.newPayment.paymentMethod,
      financial: { id: this.newPayment.financialId }
    };
    this.financialService.addPaymentWithoutUser(paymentPayload).subscribe({
      next: (response) => {
        console.log('Payment added:', response);
        alert('Payment added successfully!');
        this.cancelAddPayment();
        this.fetchFinancials();
      },
      error: (error) => {
        console.error('Error adding payment:', error);
        alert('Failed to add payment: ' + (error.message || 'Unknown error'));
      }
    });
  }

  formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return dateString;
  }

  goBack(): void {
    this.router.navigate(['/admin/financial']);
  }
  getFilteredFinancials(): any[] {
    if (!this.searchQuery.trim()) {
      return this.financials; // Si la recherche est vide, retourne tous les éléments
    }

    return this.financials.filter(financial =>
      financial.type.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      financial.transactionDate.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      financial.amount.toString().includes(this.searchQuery)
    );
  }

}
