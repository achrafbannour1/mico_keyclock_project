import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MaintenanceStats, Resource, ResourceService, Rtype } from "../../../../services/ResourceService/resource.service";
import { Subscription } from "rxjs";
import { ChartConfiguration, ChartType } from "chart.js";
import { BaseChartDirective } from "ng2-charts";
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-showadminresource',
  templateUrl: './showadminresource.component.html',
  styleUrls: ['./showadminresource.component.css']
})
export class ShowadminresourceComponent implements OnInit, OnDestroy {
  resources: Resource[] = [];
  selectedType: Rtype = Rtype.MACHINE;
  maintenanceStats: MaintenanceStats[] = [];
  isLoadingStats: boolean = false;
  private subscription: Subscription = new Subscription();
  private notifiedResources: Set<number> = new Set(); // Track notified resources to avoid duplicates

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Machine Brands' } },
      y: { title: { display: true, text: 'Number of Maintenances' }, beginAtZero: true }
    },
    plugins: { title: { display: true, text: 'Maintenance Statistics for Machines' } }
  };

  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend: boolean = false;
  public barChartData: ChartConfiguration['data']['datasets'] = [
    { data: [], label: 'Maintenance Count', backgroundColor: 'rgba(54, 162, 235, 0.6)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1 }
  ];

  constructor(public resourceService: ResourceService, private toastr: ToastrService) {} // Inject ToastrService

  ngOnInit(): void {
    this.subscription = this.resourceService.resources$.subscribe({
      next: (data) => {
        this.resources = data;
        this.checkForZeroQuantities(); // Check quantities on resource update
      },
      error: (err) => console.error('Error subscribing to resources:', err)
    });

    this.fetchMaintenanceStats();
  }

  ngAfterViewInit(): void {
    if (this.maintenanceStats.length > 0) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  filterByType(type: Rtype): void {
    this.selectedType = type;
  }

  get filteredResources(): Resource[] {
    return this.resources.filter(resource => resource.rtype === this.selectedType);
  }

  isActiveType(type: Rtype): boolean {
    return this.selectedType === type;
  }

  showStats: boolean = false;
  loadMaintenanceStats(): void {
    this.showStats = !this.showStats;
    if (this.showStats) {
      this.fetchMaintenanceStats();
    }
  }

  private fetchMaintenanceStats(): void {
    if (this.isLoadingStats) return;
    this.isLoadingStats = true;
    this.resourceService.getMaintenanceStats().subscribe({
      next: (stats) => {
        console.log('Maintenance stats:', stats);
        this.maintenanceStats = stats;
        this.updateChart();
        this.isLoadingStats = false;
      },
      error: (err) => {
        console.error('Error loading maintenance stats:', err);
        this.isLoadingStats = false;
      }
    });
  }

  private updateChart(): void {
    if (this.chart && this.maintenanceStats.length > 0) {
      this.barChartLabels = this.maintenanceStats.map(stat => stat.brande);
      this.barChartData[0].data = this.maintenanceStats.map(stat => stat.maintenanceCount);
      setTimeout(() => this.chart?.update(), 0);
    } else {
      console.warn('Chart or maintenance stats not ready for update');
    }
  }

  private checkForZeroQuantities(): void {
    this.resources.forEach(resource => {
      if ((resource.rtype === Rtype.TOOL || resource.rtype === Rtype.MATERIALS) &&
        resource.quantity === 0 &&
        !this.notifiedResources.has(resource.id)) {
        this.toastr.warning(`Resource ${resource.brande} is out of stock. Please refill.`, 'Low Stock Alert');
        this.notifiedResources.add(resource.id); // Prevent duplicate notifications
      } else if (resource.quantity > 0 && this.notifiedResources.has(resource.id)) {
        this.notifiedResources.delete(resource.id); // Reset if refilled
      }
    });
  }

  protected readonly Rtype = Rtype;
}
