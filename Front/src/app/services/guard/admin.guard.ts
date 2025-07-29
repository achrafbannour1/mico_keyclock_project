/*import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { KeycloakService } from "../keycloak/keycloak.service";

export const adminGuard: CanActivateFn = () => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (keycloakService.keycloak.isTokenExpired()) {
    keycloakService.login();
    return false;
  }

  if (keycloakService.hasRole('ADMIN')) { // Match Keycloak case
    return true;
  }

  router.navigate(['/client/home']); // Redirect to client page
  return false;
};
*/
// admin.guard.ts

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { KeycloakService } from "../keycloak/keycloak.service";

export const adminGuard: CanActivateFn = () => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  console.log('Checking admin guard - Token expired:', keycloakService.keycloak.isTokenExpired());
  console.log('User roles:', keycloakService.getRoles());

  if (keycloakService.keycloak.isTokenExpired()) {
    console.log('Token expired, redirecting to login');
    keycloakService.login();
    return false;
  }

  if (keycloakService.hasRole('ADMIN')) { // Check for 'ADMIN' (uppercase, no ROLE_ prefix here)
    console.log('User has ADMIN role, allowing access');
    return true;
  }

  console.log('User does not have ADMIN role, redirecting to /client/home');
  router.navigate(['/client/home']);
  return false;
};
