import { Component, OnInit } from '@angular/core';
import { FinancialService } from '../financial.service';
import { ResourceService } from "../../../../services/ResourceService/resource.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css']
})
export class FinancialComponent implements OnInit {
  projectsWithFinancials: any[] = [];
  allProjects: any[] = [];
  projectId: number = 0;
  amount: number = 0;
  transactionDate: string = new Date().toISOString().split('T')[0];
  financialType: string = 'PROJECT_PAYMENT';
  financialTypes = ['PROJECT_PAYMENT', 'EMPLOYEE_PAYMENT'];
  defaultImage: string = 'assets/images/default-project.jpg';
  searchQuery: string = '';

  constructor(
    private financialService: FinancialService,
    private resourceService: ResourceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProjectsWithFinancials();
    this.getAllProjects();
  }

  getProjectsWithFinancials(): void {
    this.financialService.getAllProjects().subscribe({
      next: (projects: any[]) => {
        this.financialService.getAllFinancials().subscribe({
          next: (financials: any[]) => {
            const projectIdsWithFinancials = new Set(financials.map((f: any) => f.projectId));
            this.projectsWithFinancials = projects.filter(project => projectIdsWithFinancials.has(project.id));
            console.log('Projects with financials:', this.projectsWithFinancials);
          },
          error: (error: any) => console.error('Error fetching financials:', error)
        });
      },
      error: (error: any) => console.error('Error fetching projects:', error)
    });
  }

  getAllProjects(): void {
    this.financialService.getAllProjects().subscribe({
      next: (projects: any[]) => {
        this.allProjects = projects;
        if (this.allProjects.length > 0) {
          this.projectId = this.allProjects[0].id;
        }
        console.log('All projects:', this.allProjects);
      },
      error: (error: any) => console.error('Error fetching all projects:', error)
    });
  }

  navigateToProjectFinancials(projectId: number): void {
    this.router.navigate(['/admin/project-financials', projectId]);
  }

  navigateToProjectResources(projectName: string): void {
    this.router.navigate(['/admin/project-resources', projectName]);
  }

  addFinancial(): void {
    if (this.projectId === 0) {
      alert('Please select a project');
      return;
    }
    const financialData = {
      amount: this.amount,
      transactionDate: this.transactionDate,
      financialType: this.financialType
    };
    this.financialService.addFinancial(this.projectId, financialData).subscribe({
      next: (response: any) => {
        console.log('Financial added successfully', response);
        alert('Financial added successfully!');
        this.getProjectsWithFinancials();
        this.getAllProjects();
      },
      error: (error: any) => {
        console.error('Error adding financial:', error);
        alert('Error adding financial: ' + (error.error || 'Unknown error'));
      }
    });
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.defaultImage;
  }

  getFilteredProjects(): any[] {
    if (!this.searchQuery.trim()) {
      return this.projectsWithFinancials;
    }
    return this.projectsWithFinancials.filter(project =>
      project.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
