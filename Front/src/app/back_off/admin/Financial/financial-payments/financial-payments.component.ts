import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FinancialService } from '../financial.service';
import { ActivatedRoute, Router } from '@angular/router';
interface PaymentStats {
  totalPaidAmount: number;
  totalPayments: number;
  latePaymentsCount: number;
  totalLateInterest: number;
  latePaymentRate: number;
  statusDistribution: { [key: string]: number };
  methodDistribution: { [key: string]: number };
}
@Component({
  selector: 'app-financial-payments',
  templateUrl: './financial-payments.component.html',
  styleUrls: ['./financial-payments.component.css']
})

export class FinancialPaymentsComponent implements OnInit {
  financialId: number;
  payments: any[] = [];
  financialDetails: any = null;
  selectedPaymentToEdit: any = null;
  paymentStatuses = ['COMPLETED', 'PENDING', 'FAILED'];
  paymentMethods = ['CARD', 'CASH', 'BANK_TRANSFER'];
  paymentStats: any = null;
  searchQuery: string = '';
  selectedStatus: string = 'ALL';
  totalCompletedPayments: number = 0;
  totalPendingPayments: number = 0;

  constructor(
    private financialService: FinancialService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.financialId = +this.route.snapshot.paramMap.get('financialId')!;
  }

  ngOnInit(): void {
    this.fetchFinancialDetails();
    this.fetchPayments();
   
    
  }
  


  

  fetchFinancialDetails(): void {
    this.financialService.getAllFinancials().subscribe({
      next: (financials) => {
        this.financialDetails = financials.find((f: any) => f.id === this.financialId);
        console.log('Financial details:', this.financialDetails);
      },
      error: (error) => console.error('Error fetching financial details:', error)
    });
  }

  fetchPayments(): void {
    this.financialService.getPaymentsByFinancial(this.financialId).subscribe({
      next: (data) => {
        this.payments = data.map((payment: any) => ({
          ...payment,
          paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'
        }));
        console.log('Payments for financial', this.financialId, ':', this.payments);
        this.calculateTotalCompletedPayments();
        this.cdr.detectChanges(); // Force change detection after data update
      },
      error: (error) => {
        console.error('Error fetching payments:', error);
        this.payments = [];
        this.cdr.detectChanges();
      }
    });
  }

  deletePayment(paymentId: number): void {
    this.calculateTotalCompletedPayments();
    if (!confirm('Are you sure you want to delete this payment?')) {
      return;
    }
    this.financialService.deletePayment(paymentId).subscribe({
      next: () => {
        alert('Payment deleted successfully!');
        // Manually remove the payment from the array
        this.payments = this.payments.filter(payment => payment.id !== paymentId);
        this.cdr.detectChanges(); // Force update
        this.fetchPayments(); // Still fetch to ensure sync with backend
      },
      error: (error) => {
        console.error('Error deleting payment:', error);
        alert('Failed to delete payment: ' + (error.message || 'Unknown error'));
      }
    });
  }

  editPayment(payment: any): void {
    this.selectedPaymentToEdit = { ...payment };
    this.selectedPaymentToEdit.paymentDate = this.formatDateForInput(this.selectedPaymentToEdit.paymentDate);
  }

  updatePayment(): void {
    this.calculateTotalCompletedPayments();
    if (!this.selectedPaymentToEdit || !this.selectedPaymentToEdit.id) {
      alert('No payment selected for update!');
      return;
    }
    const payload = {
      ...this.selectedPaymentToEdit,
      paymentDate: this.selectedPaymentToEdit.paymentDate
    };
    this.financialService.updatePayment(this.selectedPaymentToEdit.id, payload).subscribe({
      next: () => {
        alert('Payment updated successfully!');
        this.selectedPaymentToEdit = null;
        this.fetchPayments();
      },
      error: (error) => {
        console.error('Error updating payment:', error);
        alert('Failed to update payment: ' + (error.message || 'Unknown error'));
      }
      
    });
  }

  cancelEditPayment(): void {
    this.selectedPaymentToEdit = null;
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
    this.router.navigate(['/admin/project-financials', this.financialDetails?.projectId || 0]);
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
    console.log('Total Calculated:', this.totalCompletedPayments); // Vérifier le total
    console.log('Total Pending:', this.totalPendingPayments);
  
  }
  
}
