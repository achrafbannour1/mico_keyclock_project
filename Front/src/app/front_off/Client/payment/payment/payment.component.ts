import { Component, OnInit } from '@angular/core';
import { FinancialService } from '../../../../back_off/admin/Financial/financial.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  projects: any[] = [];
  defaultImage: string = 'assets/images/default-project.jpg';
  page: number = 1;
  itemsPerPage: number = 6;
  searchQuery: string = '';

  constructor(
    private financialService: FinancialService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAllProjects();
  }

  fetchAllProjects(): void {
    this.financialService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        console.log('All projects:', this.projects);
        console.log('Number of projects:', this.projects.length);
      },
      error: (error) => console.error('Error fetching projects:', error)
    });
  }

  navigateToProjectPayments(projectId: number): void {
    this.router.navigate(['/client/project-payments', projectId]);
  }

  navigateToProjectResources(projectName: string): void {
    this.router.navigate(['/client/project-resources', projectName]);
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.defaultImage;
  }

  changePage(page: number): void {
    this.page = page >= 1 ? page : 1;
    console.log('Current page:', this.page);
  }

  getFilteredProjects(): any[] {
    if (!this.searchQuery) {
      return this.projects;
    }
    return this.projects.filter(project =>
      project.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
