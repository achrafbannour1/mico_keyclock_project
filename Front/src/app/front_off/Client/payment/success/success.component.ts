import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialService } from '../../../../back_off/admin/Financial/financial.service'; // Adjust path

@Component({
  selector: 'app-success',
  template: `<p>Payment successful! Redirecting...</p>`
})
export class SuccessComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private financialService: FinancialService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const paymentId = this.route.snapshot.queryParamMap.get('paymentId');
    const projectId = this.route.snapshot.queryParamMap.get('projectId'); // Get projectId from query params

    if (paymentId) {
      this.financialService.completePayment(+paymentId).subscribe({
        next: (response) => {
          console.log('Payment status updated:', response);
          setTimeout(() => {
            // Navigate back to ProjectPaymentsComponent with projectId
            this.router.navigate(['/client/project-payments', projectId || '']);
          }, 2000);
        },
        error: (err) => {
          console.error('Error completing payment:', err);
          this.router.navigate(['/client/payment']); // Fallback on error
        }
      });
    } else {
      console.error('No paymentId found in query params');
      this.router.navigate(['/client/payment']); // Fallback if paymentId is missing
    }
  }
}
