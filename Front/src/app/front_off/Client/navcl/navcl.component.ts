import { Component } from '@angular/core';
import { KeycloakService } from '../../../services/keycloak/keycloak.service'; // Import KeycloakService

@Component({
  selector: 'app-navcl',
  templateUrl: './navcl.component.html',
  styleUrls: ['./navcl.component.css']
})
export class NavclComponent {
  constructor(private keycloakService: KeycloakService) {} // Inject KeycloakService

  async logout(event: Event): Promise<void> {
    event.preventDefault(); // Prevent default anchor behavior
    try {
      await this.keycloakService.logout();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  openAccountManagement(): void {
    console.log('Profile management button clicked');
    console.log('Is authenticated:', this.keycloakService.keycloak.authenticated);
    this.keycloakService.openAccountManagement();
  }
}
