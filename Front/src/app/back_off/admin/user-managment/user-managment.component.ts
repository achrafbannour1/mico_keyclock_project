import { Component, OnInit } from '@angular/core';
import { KeycloakUserService, User } from '../../../services/keycloak/KeycloakUserService';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Ensure HttpErrorResponse is imported

export enum UserRole {
  CLIENT = 'CLIENT',
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.css']
})
export class UserManagmentComponent implements OnInit {
  users: User[] = [];
  roles = Object.values(UserRole);
  isLoading: boolean = false;
  errorMessage: string = '';
  newUser: Partial<User> & { password?: string } = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    realmRoles: [UserRole.CLIENT],
    enabled: true
  };
  selectedRole: string = UserRole.CLIENT;

  constructor(
    private keycloakUserService: KeycloakUserService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.keycloakUserService.getAllUsers().subscribe({
      next: (users) => {
        console.log('Users loaded:', users);
        this.users = users.map(user => ({
          ...user,
          realmRoles: user.realmRoles.length > 0 ? user.realmRoles : [UserRole.CLIENT]
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.errorMessage = 'Failed to load users. Check console for details.';
        this.isLoading = false;
      }
    });
  }

  createUser(): void {
    if (!this.newUser.username || !this.newUser.email) {
      this.errorMessage = 'Username and email are required.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.newUser.password = this.generateTempPassword();
    this.newUser.realmRoles = [this.selectedRole];

    console.log('Payload sent to backend:', this.newUser); // Add this log

    this.keycloakUserService.createUser(this.newUser as User & { password: string }).subscribe({
      next: (createdUser) => {
        console.log('User created:', createdUser);
        this.users.push(createdUser);
        this.resetNewUserForm();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error creating user:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        this.errorMessage = `Failed to create user: ${err.status} - ${err.error?.message || err.statusText}`;
        this.isLoading = false;
      }
    });
  }

  updateUserRole(userId: string, roleName: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    const currentRoles = this.users.find(u => u.id === userId)?.realmRoles || [];
    currentRoles.forEach(role => this.keycloakUserService.removeRole(userId, role));
    this.keycloakUserService.assignRole(userId, roleName).subscribe({
      next: () => {
        this.users = this.users.map(u => u.id === userId ? { ...u, realmRoles: [roleName] } : u);
        console.log('Role updated for user:', userId);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error updating role:', err);
        this.errorMessage = 'Failed to update role. Check console for details.';
        this.isLoading = false;
      }
    });
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.isLoading = true;
      this.errorMessage = '';
      this.keycloakUserService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== userId);
          console.log('User deleted with ID:', userId);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.errorMessage = 'Failed to delete user. Check console for details.';
          this.isLoading = false;
        }
      });
    }
  }

  banUser(userId: string, ban: boolean): void {
    if (confirm(`Are you sure you want to ${ban ? 'ban' : 'unban'} this user?`)) {
      this.isLoading = true;
      this.errorMessage = '';
      this.keycloakUserService.banUser(userId, ban).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === userId);
          if (index !== -1) {
            this.users[index] = { ...this.users[index], enabled: !ban };
          }
          console.log(`User with ID ${userId} is now ${ban ? 'banned' : 'unbanned'}`);
          this.isLoading = false;
        },
        error: (err) => {
          console.error(`Error ${ban ? 'banning' : 'unbanning'} user:`, err);
          this.errorMessage = `Failed to ${ban ? 'ban' : 'unban'} user. Check console for details.`;
          this.isLoading = false;
        }
      });
    }
  }

  private generateTempPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  private resetNewUserForm(): void {
    this.newUser = {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      realmRoles: [UserRole.CLIENT],
      enabled: true
    };
    this.selectedRole = UserRole.CLIENT;
  }
}
