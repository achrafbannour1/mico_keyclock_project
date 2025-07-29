/*export interface UserProfile {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  roles?: string[]; // Optional: if you want to store roles here
}*/
export interface UserProfile {
  sub?: string; // Add sub for Keycloak user ID
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  roles?: string[]; // Optional: if you want to store roles here
}
