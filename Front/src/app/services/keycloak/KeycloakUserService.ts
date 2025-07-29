import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { KeycloakService } from './keycloak.service';

export interface User {
  id: string; // Keycloak user ID
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  enabled: boolean; // For ban status (true = enabled, false = banned)
  realmRoles: string[]; // List of roles (e.g., ["ADMIN", "MANAGER"])
}

export enum UserRole {
  CLIENT = 'CLIENT',
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

@Injectable({
  providedIn: 'root'
})
export class KeycloakUserService {
  private apiUrl = 'http://localhost:8089/keycloak/user';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient, private keycloakService: KeycloakService) {}

  getToken(): string {
    return this.keycloakService.keycloak.token || '';
  }

  private extractRealmRoles(user: any): string[] {
    let roles: string[] = [];
    console.log('Extracting roles from user:', JSON.stringify(user, null, 2)); // Detailed debug

    // Check realm_access.roles (most common for realm-level roles)
    if (user.realm_access && user.realm_access.roles && Array.isArray(user.realm_access.roles)) {
      roles = user.realm_access.roles;
      console.log('Found realm_access.roles:', roles);
    }
    // Check realmRoles directly (less common, but possible)
    else if (user.realmRoles && Array.isArray(user.realmRoles)) {
      roles = user.realmRoles;
      console.log('Found realmRoles:', roles);
    }
    // Check attributes.roles (if used)
    else if (user.attributes && user.attributes.roles) {
      roles = Array.isArray(user.attributes.roles) ? user.attributes.roles : [user.attributes.roles];
      console.log('Found attributes.roles:', roles);
    }
    // Check clientRoles (e.g., for 'account' client, though less common for realm-level roles)
    else if (user.clientRoles && user.clientRoles['account'] && Array.isArray(user.clientRoles['account'])) {
      roles = user.clientRoles['account'];
      console.log('Found clientRoles.account:', roles);
    }
    // Check any other potential role locations
    else if (user.roles && Array.isArray(user.roles)) {
      roles = user.roles;
      console.log('Found generic roles:', roles);
    }

    // Normalize and filter roles: only keep your custom roles (ADMIN, CLIENT, EMPLOYEE, MANAGER)
    // Exclude default/composite roles like default-roles-t-builders, offline_access, uma_authorization
    const customRoles = Object.values(UserRole).map(role => role.toUpperCase());
    const normalizedRoles = roles
      .map(role => {
        if (typeof role === 'string') {
          return role.replace(/^ROLE_/, '').toUpperCase().trim();
        }
        return '';
      })
      .filter(role => role.length > 0 && customRoles.includes(role)) // Only keep ADMIN, CLIENT, EMPLOYEE, MANAGER
      .filter(role => !['DEFAULT-ROLES-T-BUILDERS', 'OFFLINE_ACCESS', 'UMA_AUTHORIZATION'].includes(role)); // Exclude default roles

    console.log('Normalized and filtered roles:', normalizedRoles);
    return normalizedRoles.length > 0 ? normalizedRoles : [UserRole.CLIENT]; // Default to CLIENT if no custom roles
  }

  getAllUsers(): Observable<User[]> {
    const token = this.getToken();
    return this.http.get<User[]>(`${this.apiUrl}/all`, {
      headers: this.headers.set('Authorization', `Bearer ${token}`)
    }).pipe(
      tap(response => console.log('Raw Keycloak users response:', response)),
      map(users => users.map(user => ({
        ...user,
        realmRoles: this.extractRealmRoles(user) // Extract and normalize roles
      }))),
      catchError(err => {
        console.error('Error fetching users:', err);
        throw err;
      })
    );
  }

  getUser(userId: string): Observable<User> {
    const token = this.getToken();
    return this.http.get<User>(`${this.apiUrl}/${userId}`, {
      headers: this.headers.set('Authorization', `Bearer ${token}`)
    }).pipe(
      tap(response => console.log('Raw Keycloak user response for ID', userId, ':', response)),
      map(user => ({
        ...user,
        realmRoles: this.extractRealmRoles(user)
      })),
      catchError(err => {
        console.error('Error fetching user:', err);
        throw err;
      })
    );
  }

  getUserRoles(userId: string): Observable<string[]> {
    const token = this.getToken();
    return this.http.get<any>(`${this.apiUrl}/roles/${userId}`, {
      headers: this.headers.set('Authorization', `Bearer ${token}`)
    }).pipe(
      tap(response => console.log('Raw Keycloak user roles response for ID', userId, ':', response)),
      map(response => {
        const roles = this.extractRealmRoles(response);
        return roles.length > 0 ? roles : [UserRole.CLIENT]; // Default to CLIENT if no roles
      }),
      catchError(err => {
        console.error('Error fetching user roles:', err);
        return of([UserRole.CLIENT]); // Default to CLIENT if error occurs
      })
    );
  }

  deleteUser(userId: string): Observable<void> {
    const token = this.getToken();
    return this.http.delete<void>(`${this.apiUrl}/${userId}`, {
      headers: this.headers.set('Authorization', `Bearer ${token}`)
    }).pipe(
      tap(() => console.log('User deleted with ID:', userId)),
      catchError(err => {
        console.error('Error deleting user:', err);
        throw err;
      })
    );
  }

  banUser(userId: string, ban: boolean): Observable<User> {
    const token = this.getToken();
    return this.http.put<User>(`${this.apiUrl}/ban/${userId}?ban=${ban}`, null, {
      headers: this.headers.set('Authorization', `Bearer ${token}`)
    }).pipe(
      tap(updatedUser => console.log(`User with ID ${userId} is now ${ban ? 'banned' : 'unbanned'}`)),
      map(user => ({
        ...user,
        realmRoles: this.extractRealmRoles(user)
      })),
      catchError(err => {
        console.error(`Error ${ban ? 'banning' : 'unbanning'} user:`, err);
        throw err;
      })
    );
  }

  assignRole(userId: string, roleName: string): Observable<void> {
    const token = this.getToken();
    return this.http.post<void>(`${this.apiUrl}/assign-role/${userId}?roleName=${roleName}`, null, {
      headers: this.headers.set('Authorization', `Bearer ${token}`)
    }).pipe(
      tap(() => console.log('Role assigned to user:', userId)),
      catchError(err => {
        console.error('Error assigning role:', err);
        throw err;
      })
    );
  }

  removeRole(userId: string, roleName: string): Observable<void> {
    const token = this.getToken();
    return this.http.post<void>(`${this.apiUrl}/remove-role/${userId}?roleName=${roleName}`, null, {
      headers: this.headers.set('Authorization', `Bearer ${token}`)
    }).pipe(
      tap(() => console.log('Role removed from user:', userId)),
      catchError(err => {
        console.error('Error removing role:', err);
        throw err;
      })
    );
  }

  // Optional: Fetch all available roles from Keycloak
  getAvailableRoles(): Observable<string[]> {
    const token = this.getToken();
    return this.http.get<any>(`${this.apiUrl}/roles`, {
      headers: this.headers.set('Authorization', `Bearer ${token}`)
    }).pipe(
      map(response => {
        const roles = response.roles || [];
        return roles.map((role: any) => role.name.toUpperCase().trim());
      }),
      catchError(err => {
        console.error('Error fetching available roles:', err);
        return of(Object.values(UserRole).map(role => role.toUpperCase()));
      })
    );
  }
  createUser(user: User & { password: string }): Observable<User> {
    const token = this.getToken();
    return this.http.post<User>(`${this.apiUrl}/create`, user, {
      headers: this.headers.set('Authorization', `Bearer ${token}`)
    }).pipe(
      tap(response => console.log('User created response:', response)),
      map(createdUser => ({
        ...createdUser,
        realmRoles: this.extractRealmRoles(createdUser)
      })),
      catchError(err => {
        console.error('Error creating user:', err);
        throw err;
      })
    );
  }
}
