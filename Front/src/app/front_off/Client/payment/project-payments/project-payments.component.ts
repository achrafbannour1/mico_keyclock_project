import { Component, OnInit } from '@angular/core';
import { FinancialService } from '../../../../back_off/admin/Financial/financial.service'; // Adjust path
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/services/paymentHistory/payment.service';
@Component({
  selector: 'app-project-payments',
  templateUrl: './project-payments.component.html',
  styleUrls: ['./project-payments.component.css']
})
export class ProjectPaymentsComponent implements OnInit {
  projectId: number = 0;
  financials: any[] = [];
 // payments: any[] = [];
  projectName: string = '';
  exchangeRates: any = {};
  selectedStatus: string = 'ALL';

  payments: {
    id: number;
    paymentAmount: number;
    paymentDate: string;
    lateInterest: number | null;
    isLate:number | boolean;
    paymentStatus: string;
    paymentMethod: string;
    financial?: { id: number };
  }[] = [];
 
  totalCompletedPayments: number = 0;
  totalPendingPayments: number = 0;


  constructor(
    private financialService: FinancialService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to route param changes to handle redirects
    this.route.paramMap.subscribe(params => {
      this.projectId = +params.get('projectId')! || 0; // Default to 0 if not found
      this.fetchProjectDetails();
      this.fetchFinancialsAndPayments();
      setInterval(() => this.fetchFinancialsAndPayments(), 60000);
      this.getExchangeRates();
    });
  }

  fetchProjectDetails(): void {
    this.financialService.getAllProjects().subscribe({
      next: (projects) => {
        const project = projects.find((p: any) => p.id === this.projectId);
        this.projectName = project ? project.name : 'Unknown Project';
      },
      error: (error) => console.error('Error fetching project details:', error)
    });
  }

  fetchFinancialsAndPayments(): void {
    this.financialService.getFinancialsByProjectId(this.projectId).subscribe({
      next: (financials) => {
        this.financials = financials;
        this.payments = [];
        financials.forEach((financial: any) => {
          this.financialService.getPaymentsByFinancial(financial.id).subscribe({
            next: (financialPayments) => {
              this.payments = [...this.payments, ...financialPayments];
              this.calculateTotalCompletedPayments();
            },
            error: (error) => console.error(`Error fetching payments for financial ${financial.id}:`, error)
          });
        });
      },
      error: (error) => console.error('Error fetching financials:', error)
    });
  }

  goBack(): void {
    this.router.navigate(['/client/payment']);
  }

  pay(paymentId: number): void {
    this.financialService.createCheckoutSession(paymentId).subscribe({
      next: (response) => {
        window.location.href = response.url; // Redirect to Stripe checkout
      },
      error: (error) => {
        console.error('Error initiating payment:', error);
        alert('Failed to initiate payment. Please try again.');
      }
    });

  }


  getExchangeRates(): void {
    this.paymentService.getExchangeRates().subscribe({
      next: (data) => {
        this.exchangeRates = data.rates;
        console.log("Taux de change récupérés :", this.exchangeRates);
      },
      error: (error) => console.error("Erreur lors de la récupération des taux de change :", error)
    });
  }
  convertCurrency(amount: number, targetCurrency: string): void {
    if (!this.exchangeRates || !this.exchangeRates[targetCurrency]) {
      console.error("Taux de change non disponibles pour", targetCurrency);
      alert("Les taux de change ne sont pas encore disponibles.");
      return;
    }
  
    const convertedAmount = amount * this.exchangeRates[targetCurrency];
    alert(`convertedAmount : ${convertedAmount.toFixed(2)} ${targetCurrency}`);
  }
  getFilteredPayments(): any[] {
    if (this.selectedStatus === 'ALL') {
      return this.payments;
    }
    return this.payments.filter(payment => payment.paymentStatus === this.selectedStatus);
  }
  calculateTotalCompletedPayments() {
    this.totalCompletedPayments = this.payments
      .filter(payment => payment.paymentStatus === 'COMPLETED')
      .reduce((sum, payment) => {
        console.log('Payment Amount:', payment.paymentAmount); // Vérifier chaque montant
        return sum + (payment.paymentAmount || 0); // Ajouter une vérification pour éviter undefined
      }, 0);
      this.totalPendingPayments = this.payments
    .filter(payment => payment.paymentStatus === 'PENDING')
    .reduce((sum, payment) => sum + (payment.paymentAmount || 0), 0);
    console.log('Total Calculated:', this.totalCompletedPayments); 
    console.log('Total Pending:', this.totalPendingPayments);
  }
}
