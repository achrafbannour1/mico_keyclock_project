import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakUserService, User, UserRole } from '../../../services/keycloak/KeycloakUserService'; // Adjust path as needed

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.css']
})
export class UserRolesComponent implements OnInit {
  userId: string = '';
  user: User | null = null;
  availableRoles: string[] = Object.values(UserRole);
  userRoles: string[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private keycloakUserService: KeycloakUserService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    if (this.userId) {
      this.loadUserAndRoles();
    } else {
      this.errorMessage = 'User ID is missing.';
    }
  }

  loadUserAndRoles(): void {
    this.isLoading = true;
    this.errorMessage = '';
    // Fetch user data
    this.keycloakUserService.getUser(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        console.log('User loaded:', user); // Debug user data
        // Fetch user roles specifically
        this.keycloakUserService.getUserRoles(this.userId).subscribe({
          next: (roles) => {
            this.userRoles = roles;
            if (this.user) {
              this.user.realmRoles = [...this.userRoles];
            }
            console.log('User roles loaded:', this.userRoles);
            if (this.userRoles.length === 0) {
              console.warn('No roles found for user ID:', this.userId);
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error loading user roles:', err);
            this.errorMessage = 'Failed to load user roles. Check console for details.';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading user:', err);
        this.errorMessage = 'Failed to load user. Check console for details.';
        this.isLoading = false;
      }
    });
  }

  addRole(roleName: string): void { // Explicitly type roleName as string
    if (!this.userId || this.userRoles.includes(roleName)) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.keycloakUserService.assignRole(this.userId, roleName).subscribe({
      next: () => {
        this.userRoles.push(roleName);
        if (this.user) {
          this.user.realmRoles = [...this.userRoles]; // Update user object
        }
        console.log('Role added to user:', roleName);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error adding role:', err);
        this.errorMessage = 'Failed to add role. Check console for details.';
        this.isLoading = false;
      }
    });
  }

  removeRole(roleName: string): void {
    if (!this.userId || !this.userRoles.includes(roleName)) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.keycloakUserService.removeRole(this.userId, roleName).subscribe({
      next: () => {
        this.userRoles = this.userRoles.filter(r => r !== roleName);
        if (this.user) {
          this.user.realmRoles = [...this.userRoles]; // Update user object
        }
        console.log('Role removed from user:', roleName);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error removing role:', err);
        this.errorMessage = 'Failed to remove role. Check console for details.';
        this.isLoading = false;
      }
    });
  }

  backToUserManagement(): void {
    this.router.navigate(['/admin/user-management']);
  }

  // Optional: Add a method to handle the change event with type safety
  onRoleChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const roleName = selectElement.value;
    if (roleName) {
      this.addRole(roleName);
    }
  }
}
