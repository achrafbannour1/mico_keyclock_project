import { Component } from '@angular/core';
import {KeycloakService} from "../../../services/keycloak/keycloak.service";

@Component({
  selector: 'app-nav-manager',
  templateUrl: './nav-manager.component.html',
  styleUrls: ['./nav-manager.component.css']
})
export class NavManagerComponent {
constructor(private key:KeycloakService) {
}
  async logout(event: Event): Promise<void> {
    event.preventDefault(); // Prevent default anchor behavior
    try {
      await this.key.logout();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
  openAccountManagement(): void {
    console.log('Profile management button clicked');
    console.log('Is authenticated:', this.key.keycloak.authenticated);
    this.key.openAccountManagement();
  }

}
