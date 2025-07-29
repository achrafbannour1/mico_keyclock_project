import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { KeycloakService } from "../keycloak/keycloak.service";

export const managerGuard: CanActivateFn = () => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (keycloakService.keycloak.isTokenExpired()) {
    keycloakService.login();
    return false;
  }

  if (keycloakService.hasRole('MANAGER')) { // Match Keycloak case
    return true;
  }

  router.navigate(['/client/home']); // Redirect to client page
  return false;
};
