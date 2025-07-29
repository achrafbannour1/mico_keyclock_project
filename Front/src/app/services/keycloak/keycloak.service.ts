/*
import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { UserProfile } from './user-profile';
import { Router } from '@angular/router';

export interface KeycloakTokenParsed {
  sub?: string;
  preferred_username?: string;
  email?: string;
  realm_access?: {
    roles: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private _keycloak: Keycloak | undefined;
  private _profile: UserProfile | undefined;

  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:9090',
        realm: 't-builders',
        clientId: 'bnb'
      });
    }
    return this._keycloak;
  }

  get profile(): UserProfile | undefined {
    return this._profile;
  }

  get tokenParsed(): KeycloakTokenParsed | undefined {
    return this.keycloak.tokenParsed as KeycloakTokenParsed;
  }

  constructor(private router: Router) {}

  async init(): Promise<void> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'login-required'
      });

      if (authenticated) {
        this._profile = (await this.keycloak.loadUserInfo()) as UserProfile;
        this._profile.token = this.keycloak.token;
        console.log('JWT Token Parsed:', this.keycloak.tokenParsed);
        this.redirectBasedOnRole();
      } else {
        console.error('Authentication failed');
      }
    } catch (error) {
      console.error('Error during Keycloak initialization:', error);
    }
  }

  login() {
    return this.keycloak.login();
  }

  async logout(): Promise<void> {
    try {
      await this.keycloak.logout({
        redirectUri: window.location.origin
      });
      this._keycloak = undefined;
      this._profile = undefined;
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  openAccountManagement(): void {
    if (!this.keycloak.authenticated) {
      console.error('User not authenticated, redirecting to login...');
      this.login();
      return;
    }
    const accountUrl = `${this.keycloak.authServerUrl}/realms/${this.keycloak.realm}/account`;
    window.open(accountUrl, '_blank');
  }

  getRoles(): string[] {
    return this.tokenParsed?.realm_access?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  private redirectBasedOnRole(): void {
    if (this.hasRole('ADMIN')) {
      console.log('Redirecting to /admin');
      this.router.navigate(['/admin']);
    } else if (this.hasRole('MANAGER')) {
      console.log('Redirecting to /Manager/resource');
      this.router.navigate(['/Manager/resource']);
    } else {
      console.log('Redirecting to /client/home');
      this.router.navigate(['/client/home']);
    }
  }
}

 */

import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { UserProfile } from './user-profile';
import { Router } from '@angular/router';

export interface KeycloakTokenParsed {
  sub?: string;
  preferred_username?: string;
  email?: string;
  realm_access?: {
    roles: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private _keycloak: Keycloak | undefined;
  private _profile: UserProfile | undefined;

  get keycloak() {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:9090',
        realm: 't-builders',
        clientId: 'bnb'
      });
    }
    return this._keycloak;
  }

  get profile(): UserProfile | undefined {
    return this._profile;
  }

  get tokenParsed(): KeycloakTokenParsed | undefined {
    return this.keycloak.tokenParsed as KeycloakTokenParsed;
  }

  constructor(private router: Router) {}

  async init(): Promise<void> {
    try {
      // Store the current URL before initiating authentication
      const redirectUri = window.location.href;

      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso', // Changed from 'login-required' to avoid forced login
        redirectUri: redirectUri // Preserve the current URL
      });

      if (authenticated) {
        this._profile = (await this.keycloak.loadUserInfo()) as UserProfile;
        this._profile.token = this.keycloak.token;
        console.log('JWT Token Parsed:', this.keycloak.tokenParsed);

        // Only redirect based on role if not returning from a specific action (e.g., Stripe payment)
        const urlParams = new URLSearchParams(window.location.search);
        if (!urlParams.get('session_id')) {
          this.redirectBasedOnRole();
        }
      } else {
        // User not authenticated, trigger login but preserve the redirect URI
        this.keycloak.login({ redirectUri });
      }
    } catch (error) {
      console.error('Error during Keycloak initialization:', error);
    }
  }

  login() {
    return this.keycloak.login({ redirectUri: window.location.href });
  }

  async logout(): Promise<void> {
    try {
      // Clear wheel state on logout
      const userId = this.tokenParsed?.sub;
      if (userId) {
        localStorage.removeItem(`wheel_state_${userId}`);
      }
      await this.keycloak.logout({
        redirectUri: window.location.origin
      });
      this._keycloak = undefined;
      this._profile = undefined;
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  openAccountManagement(): void {
    if (!this.keycloak.authenticated) {
      console.error('User not authenticated, redirecting to login...');
      this.login();
      return;
    }
    const accountUrl = `${this.keycloak.authServerUrl}/realms/${this.keycloak.realm}/account`;
    window.open(accountUrl, '_blank');
  }

  getRoles(): string[] {
    return this.tokenParsed?.realm_access?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  private redirectBasedOnRole(): void {
    if (this.hasRole('ADMIN')) {
      console.log('Redirecting to /admin');
      this.router.navigate(['/admin']);
    } else if (this.hasRole('MANAGER')) {
      console.log('Redirecting to /Manager/resource');
      this.router.navigate(['/Manager/resource']);
    } else {
      console.log('Redirecting to /client/home');
      this.router.navigate(['/client/home']);
    }
  }
}
