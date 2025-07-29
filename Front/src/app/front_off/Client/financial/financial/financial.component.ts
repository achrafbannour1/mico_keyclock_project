import { Component } from '@angular/core';
import { FinancialService } from 'src/app/services/financial/financial.service';

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css']
})
export class FinancialComponent {
  selectedProjectId: number | null = null;
  quotes: any[] = [];

  constructor(private financialService: FinancialService) {}

  showQuotes(projectId: number) {
    this.selectedProjectId = projectId;
    this.financialService.getQuotesByProject(projectId).subscribe(data => {
      this.quotes = data;
    });
  }
  financials: any[] = [];



}
