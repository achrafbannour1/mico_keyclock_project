package esprit.usergestion.Services;

import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.WebApplicationException;
import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KeycloakAdminService {
    private static final String SERVER_URL = "http://localhost:9090";
    private static final String REALM = "t-builders";
    private static final String CLIENT_ID = "admin-cli"; // Use admin-cli or your client with admin roles
    private static final String CLIENT_SECRET = "your-client-secret"; // Replace with your client secret
    private static final String ADMIN_USERNAME = "admin"; // Replace with your Keycloak admin username
    private static final String ADMIN_PASSWORD = "admin"; // Replace with your Keycloak admin password
    private static final Logger logger = Logger.getLogger(KeycloakAdminService.class.getName());

    private Keycloak getKeycloakInstance() {
        try {
            return KeycloakBuilder.builder()
                    .serverUrl(SERVER_URL)
                    .realm("master") // Use master realm for admin access
                    .clientId(CLIENT_ID)
                    .clientSecret(CLIENT_SECRET)
                    .username(ADMIN_USERNAME)
                    .password(ADMIN_PASSWORD)
                    .build();
        } catch (Exception e) {
            logger.severe("Failed to initialize Keycloak admin client: " + e.getMessage());
            throw new RuntimeException("Keycloak initialization failed", e);
        }
    }

    public List<UserRepresentation> getAllUsers() {
        Keycloak keycloak = getKeycloakInstance();
        try {
            return keycloak.realm(REALM).users().list();
        } catch (WebApplicationException e) {
            logger.severe("Failed to fetch users: " + e.getMessage());
            throw new RuntimeException("Failed to fetch users from Keycloak", e);
        }
    }

    public UserRepresentation getUser(String userId) {
        Keycloak keycloak = getKeycloakInstance();
        try {
            return keycloak.realm(REALM).users().get(userId).toRepresentation();
        } catch (NotFoundException e) {
            logger.warning("User not found with ID: " + userId);
            throw e;
        } catch (WebApplicationException e) {
            logger.severe("Failed to fetch user: " + e.getMessage());
            throw new RuntimeException("Failed to fetch user from Keycloak", e);
        }
    }

    public void deleteUser(String userId) {
        Keycloak keycloak = getKeycloakInstance();
        try {
            keycloak.realm(REALM).users().delete(userId);
            logger.info("User with ID " + userId + " deleted successfully from Keycloak");
        } catch (NotFoundException e) {
            logger.warning("User not found with ID: " + userId);
            throw e;
        } catch (WebApplicationException e) {
            logger.severe("Failed to delete user with ID " + userId + ": " + e.getMessage());
            throw new RuntimeException("Failed to delete user from Keycloak: " + e.getMessage(), e);
        }
    }

    public void banUser(String userId, boolean ban) {
        // In Keycloak, "banning" can be simulated by disabling the user
        UserRepresentation user = getUser(userId);
        if (user != null) {
            user.setEnabled(!ban); // Disable user to "ban," enable to "unban"
            Keycloak keycloak = getKeycloakInstance();
            try {
                keycloak.realm(REALM).users().get(userId).update(user);
                logger.info("User with ID " + userId + " is now " + (ban ? "banned" : "unbanned"));
            } catch (WebApplicationException e) {
                logger.severe("Failed to update user status for ID " + userId + ": " + e.getMessage());
                throw new RuntimeException("Failed to update user status in Keycloak", e);
            }
        } else {
            throw new NotFoundException("User not found with ID: " + userId);
        }
    }

    public void assignRole(String userId, String roleName) {
        Keycloak keycloak = getKeycloakInstance();
        try {
            RoleRepresentation role = keycloak.realm(REALM).roles().get(roleName).toRepresentation();
            keycloak.realm(REALM).users().get(userId).roles().realmLevel().add(Collections.singletonList(role));
            logger.info("Assigned role " + roleName + " to user with ID " + userId);
        } catch (WebApplicationException e) {
            logger.severe("Failed to assign role " + roleName + " to user ID " + userId + ": " + e.getMessage());
            throw new RuntimeException("Failed to assign role in Keycloak", e);
        }
    }

    public void removeRole(String userId, String roleName) {
        Keycloak keycloak = getKeycloakInstance();
        try {
            RoleRepresentation role = keycloak.realm(REALM).roles().get(roleName).toRepresentation();
            keycloak.realm(REALM).users().get(userId).roles().realmLevel().remove(Collections.singletonList(role));
            logger.info("Removed role " + roleName + " from user with ID " + userId);
        } catch (WebApplicationException e) {
            logger.severe("Failed to remove role " + roleName + " from user ID " + userId + ": " + e.getMessage());
            throw new RuntimeException("Failed to remove role in Keycloak", e);
        }
    }

    public List<RoleRepresentation> getAllRoles() {
        Keycloak keycloak = getKeycloakInstance();
        try {
            return keycloak.realm(REALM).roles().list();
        } catch (WebApplicationException e) {
            logger.severe("Failed to fetch roles: " + e.getMessage());
            throw new RuntimeException("Failed to fetch roles from Keycloak", e);
        }
    }

    public List<RoleRepresentation> getUserRoles(String userId) {
        Keycloak keycloak = getKeycloakInstance();
        try {
            UserRepresentation user = keycloak.realm(REALM).users().get(userId).toRepresentation();
            List<RoleRepresentation> realmRoles = keycloak.realm(REALM).users().get(userId).roles().realmLevel().listAll();
            // Filter out default/composite roles
            return realmRoles.stream()
                    .filter(role -> List.of("ADMIN", "CLIENT", "EMPLOYEE", "MANAGER").contains(role.getName().toUpperCase()))
                    .filter(role -> !List.of("DEFAULT-ROLES-T-BUILDERS", "OFFLINE_ACCESS", "UMA_AUTHORIZATION").contains(role.getName().toUpperCase()))
                    .collect(Collectors.toList());
        } catch (NotFoundException e) {
            logger.warning("User not found with ID: " + userId);
            throw e;
        } catch (WebApplicationException e) {
            logger.severe("Failed to fetch user roles for ID " + userId + ": " + e.getMessage());
            throw new RuntimeException("Failed to fetch user roles from Keycloak", e);
        }
    }
    public void createUser(UserRepresentation user) {
        Keycloak keycloak = getKeycloakInstance();
        try {
            jakarta.ws.rs.core.Response response = keycloak.realm(REALM).users().create(user);
            if (response.getStatus() == 201) {
                logger.info("User created successfully with username: " + user.getUsername());
            } else {
                logger.severe("Failed to create user, status: " + response.getStatus() + ", response: " + response.readEntity(String.class));
                throw new RuntimeException("User creation failed with status: " + response.getStatus());
            }
        } catch (WebApplicationException e) {
            logger.severe("Failed to create user: " + e.getMessage());
            throw new RuntimeException("Failed to create user in Keycloak", e);
        }
    }

    public UserRepresentation getUserByUsername(String username) {
        Keycloak keycloak = getKeycloakInstance();
        try {
            List<UserRepresentation> users = keycloak.realm(REALM).users().search(username, true);
            return users.isEmpty() ? null : users.get(0);
        } catch (WebApplicationException e) {
            logger.severe("Failed to fetch user by username: " + e.getMessage());
            throw new RuntimeException("Failed to fetch user by username from Keycloak", e);
        }
    }
    public String createUserAndGetId(UserRepresentation user) {
        Keycloak keycloak = getKeycloakInstance();
        try {
            jakarta.ws.rs.core.Response response = keycloak.realm(REALM).users().create(user);
            if (response.getStatus() == 201) {
                String locationHeader = response.getHeaderString("Location");
                if (locationHeader != null) {
                    String userId = locationHeader.substring(locationHeader.lastIndexOf("/") + 1);
                    logger.info("User created successfully with ID: " + userId + ", username: " + user.getUsername());
                    return userId;
                } else {
                    throw new RuntimeException("User created but ID not found in response");
                }
            } else {
                logger.severe("Failed to create user, status: " + response.getStatus() + ", response: " + response.readEntity(String.class));
                throw new RuntimeException("User creation failed with status: " + response.getStatus());
            }
        } catch (WebApplicationException e) {
            logger.severe("Failed to create user: " + e.getMessage());
            throw new RuntimeException("Failed to create user in Keycloak", e);
        }
    }
}