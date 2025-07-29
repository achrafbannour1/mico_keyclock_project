import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { tap } from 'rxjs/operators';

export interface Resource {
  id: number;
  plateNumber: string;
  brande: string;
  price: number;
  rtype: Rtype;
  quantity: number;
  monthsPay: number;
  status: boolean; // Changed to boolean for consistency with backend
  nbWorkHours: number;
}

export enum Rtype {
  TOOL = "TOOL",
  MACHINE = "MACHINE",
  MATERIALS = "MATERIALS"
}

export enum Mtype {
  OIL = "OIL",
  AIR_FILER = "AIR_FILER",
  OIL_FILTER = "OIL_FILTER",
  TIRES = "TIRES"
}

export interface Maintenance {
  id: number;
  description: string;
  cost: number;
  maintainDate: Date | '';
  nbWHMainatain: number;
  mtype: Mtype | '';
  status: boolean;
}

export interface AffectationDTO {
  id: number;
  startDate: Date | '';
  endDate: Date | '';
  workHours: number;
  quantity: number;
  projectName: string;
  resourceBrand: string;
  pricePerUnit: number; // Required since we set a default
  subtotal: number;     // Required since we set a default
  rtype: Rtype;         // Required since we set a default
  imageUrl: string;     // Required since we set a default
  pricePerHour: number; // Required since we set a default
}

export interface Project {
  id: number;
  name: string;
}
export interface MaintenanceStats {
  brande: string;
  maintenanceCount: number;
}
export interface MaintenancePrediction {
  machineBrand: string;
  predictedMaintenanceType: string;
  hoursUntilMaintenance: number;
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private brandImages: { [key: string]: string } = {
    'Backhoe Loader': 'assets/images/Backhoe Loader.jpg',
    'Excavator': 'assets/images/Excavator.jpg',
    'cement truck': 'assets/images/cement truck.jpg',
    'Dozer': 'assets/images/Dozer.jpg',
    'bobcat': 'assets/images/bobcat.jpg',
    'tower': 'assets/images/tower crane.jpg',
    'Bucket': 'assets/images/Bucket.jpg',
    'Drill': 'assets/images/Drill.png',
    'Hammer': 'assets/images/Hammer.jpg',
    'Level': 'assets/images/Level.jpg',
    'Meter': 'assets/images/Meter.jpg',
    'Trowel': 'assets/images/Trowel.jpg',
    'Steel': 'assets/images/Steel.jpg',
    'bricks': 'assets/images/brick.jpg',
    'concrete': 'assets/images/ciment.jpg',
    'concrete stones': 'assets/images/concrete stones.jpg',
    'sand': 'assets/images/sand.jpg',
    'OIL': 'assets/images/oil.jpg',
    'AIR_FILER': 'assets/images/air_filter.jpg',
    'OIL_FILTER': 'assets/images/oil_filter.jpg',
    'TIRES': 'assets/images/tire.png',
  };

  private apiUrl = 'http://localhost:8089/resource';
  private resourcesSubject = new BehaviorSubject<Resource[]>([]);
  resources$ = this.resourcesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialResources();
    window.addEventListener('storage', (event) => {
      if (event.key === 'resourceUpdate') {
        this.refreshResources();
      }
    });
  }

  private loadInitialResources(): void {
    this.getResources().subscribe({
      next: (resources) => this.resourcesSubject.next(resources),
      error: (err) => console.error('Error loading initial resources:', err)
    });
  }

  getResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.apiUrl}/getallresource`);
  }

  getResourceById(id: number): Observable<Resource> {
    return this.http.get<Resource>(`${this.apiUrl}/getresourcebyid/${id}`);
  }

  addResource(resource: Resource): Observable<Resource> {
    return this.http.post<Resource>(`${this.apiUrl}/addresource`, resource).pipe(
      tap(() => this.refreshResourcesWithEvent())
    );
  }

  getBrandImage(brand: string): string {
    return this.brandImages[brand] || 'assets/images/default-car.jpg';
  }

  updateResource(resource: Resource): Observable<Resource> {
    return this.http.put<Resource>(`${this.apiUrl}/updateresource`, resource).pipe(
      tap(() => this.refreshResourcesWithEvent())
    );
  }
  checkPlateNumberExists(plateNumber: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-plate-number/${plateNumber}`);
  }
  removeResource(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/removeresource/${id}`).pipe(
      tap(() => this.refreshResourcesWithEvent())
    );
  }

  getAllMaintenanceOfMachine(id: number): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(`${this.apiUrl}/getAllMainatainOfMachine/${id}`);
  }

  addMaintenance(id: number, maintenance: Maintenance): Observable<Maintenance> {
    return this.http.post<Maintenance>(`${this.apiUrl}/affectMaintain/${id}`, maintenance);
  }

  removeMaintenance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/removeMaintain/${id}`);
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/getallprojects`);
  }

  affectResourceToProject(idr: number, idp: number, affection: any): Observable<Resource> {
    return this.http.post<Resource>(`${this.apiUrl}/affecttoproject/${idr}/${idp}`, affection).pipe(
      tap(() => this.refreshResourcesWithEvent())
    );
  }

  getAllAffectations(): Observable<AffectationDTO[]> {
    return this.http.get<AffectationDTO[]>(`${this.apiUrl}/getAllAffectations`);
  }

  removeAffectation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/removeAffectation/${id}`).pipe(
      tap(() => this.refreshResourcesWithEvent())
    );
  }

  private refreshResources(): void {
    this.getResources().subscribe({
      next: (resources) => this.resourcesSubject.next(resources),
      error: (err) => console.error('Error refreshing resources:', err)
    });
  }

  private refreshResourcesWithEvent(): void {
    this.refreshResources();
    localStorage.setItem('resourceUpdate', Date.now().toString());
  }
  getMaintenanceStats(): Observable<MaintenanceStats[]> {
    return this.http.get<MaintenanceStats[]>(`${this.apiUrl}/maintenance-stats`);
  }
  updateAffectationQuantity(affectation: AffectationDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/updateAffectationQuantity/${affectation.id}`, { quantity: affectation.quantity }).pipe(
      tap(() => this.refreshResourcesWithEvent())
    );
  }
  predictNextMaintenance(resourceId: number): Observable<MaintenancePrediction> {
    return this.http.get<MaintenancePrediction>(`${this.apiUrl}/predict-maintenance/${resourceId}`);
  }

  createCheckoutSession(userId: string): Observable<{ sessionId: string }> {
    return this.http.post<{ sessionId: string }>(`${this.apiUrl}/create-checkout-session`, { userId });
  }

  verifyPayment(sessionId: string): Observable<{ isPaid: boolean }> {
    return this.http.get<{ isPaid: boolean }>(`${this.apiUrl}/verify-payment/${sessionId}`);
  }
}
