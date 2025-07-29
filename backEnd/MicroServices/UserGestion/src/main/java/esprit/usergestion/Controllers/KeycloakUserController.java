package esprit.usergestion.Controllers;

import esprit.usergestion.Services.KeycloakAdminService;
import lombok.AllArgsConstructor;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import esprit.usergestion.Services.EmailService;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.logging.Logger;
@RestController
@RequestMapping("/keycloak/user")
@AllArgsConstructor
public class KeycloakUserController {
    private final KeycloakAdminService keycloakAdminService;
    private final EmailService emailService; // Inject EmailService
    private static final Logger logger = Logger.getLogger(KeycloakUserController.class.getName()); // Add this logger
    // Define constants locally (or reference from KeycloakAdminService if made public/static)
    private static final String SERVER_URL = "http://localhost:9090";
    private static final String REALM = "t-builders";

    @GetMapping("/all")
    public List<UserRepresentation> getAllUsers() {
        return keycloakAdminService.getAllUsers();
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserRepresentation getUser(@PathVariable String userId) {
        return keycloakAdminService.getUser(userId);
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(@PathVariable String userId) {
        keycloakAdminService.deleteUser(userId);
    }

    @PutMapping("/ban/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void banUser(@PathVariable String userId, @RequestParam boolean ban) {
        keycloakAdminService.banUser(userId, ban);
    }

    @PostMapping("/assign-role/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void assignRole(@PathVariable String userId, @RequestParam String roleName) {
        keycloakAdminService.assignRole(userId, roleName);
    }

    @PostMapping("/remove-role/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public void removeRole(@PathVariable String userId, @RequestParam String roleName) {
        keycloakAdminService.removeRole(userId, roleName);
    }

    @GetMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public List<String> getAvailableRoles() {
        return keycloakAdminService.getAllRoles().stream()
                .map(RoleRepresentation::getName)
                .map(String::toUpperCase)
                .collect(Collectors.toList());
    }

    @GetMapping("/roles/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<String> getUserRoles(@PathVariable String userId) {
        UserRepresentation user = keycloakAdminService.getUser(userId);
        if (user == null) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        return keycloakAdminService.getUserRoles(userId).stream()
                .map(RoleRepresentation::getName)
                .map(String::toUpperCase)
                .filter(role -> List.of("ADMIN", "CLIENT", "EMPLOYEE", "MANAGER").contains(role))
                .filter(role -> !List.of("DEFAULT-ROLES-T-BUILDERS", "OFFLINE_ACCESS", "UMA_AUTHORIZATION").contains(role))
                .collect(Collectors.toList());
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public UserRepresentation createUser(@RequestBody UserRequest userRequest) {
        try {
            UserRepresentation newUser = new UserRepresentation();
            newUser.setUsername(userRequest.getUsername());
            newUser.setEmail(userRequest.getEmail());
            newUser.setFirstName(userRequest.getFirstName());
            newUser.setLastName(userRequest.getLastName());
            newUser.setEnabled(true);
            newUser.setEmailVerified(false);

            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(userRequest.getPassword());
            credential.setTemporary(true);
            newUser.setCredentials(Collections.singletonList(credential));

            String userId = keycloakAdminService.createUserAndGetId(newUser);
            UserRepresentation createdUser = keycloakAdminService.getUser(userId);
            if (createdUser == null) {
                logger.severe("User created but not found with ID: " + userId);
                throw new RuntimeException("Failed to retrieve created user after creation");
            }

            String role = userRequest.getRole();
            logger.info("Role received from request: " + role); // Log the role
            if (role == null) {
                logger.warning("No role provided for user ID: " + userId + "; defaulting to CLIENT");
                role = "CLIENT";
            }
            keycloakAdminService.assignRole(createdUser.getId(), role);
            logger.info("Role " + role + " assigned to user ID: " + userId); // Log after assignment

            try {
                emailService.sendMeetingInvitation(
                        userRequest.getEmail(),
                        "Welcome to T-Builders - Your Account Details",
                        "Your account has been created. Use this temporary password to log in: " + userRequest.getPassword() +
                                "\nPlease reset your password after logging in at: " + SERVER_URL + "/realms/" + REALM + "/account"
                );
            } catch (Exception emailException) {
                logger.warning("User created with ID " + userId + ", but failed to send email: " + emailException.getMessage());
            }

            return createdUser;
        } catch (Exception e) {
            logger.severe("Failed to create user: " + e.getMessage());
            throw new RuntimeException("Failed to create user: " + e.getMessage(), e);
        }
    }

    // Helper class for request body
    static class UserRequest {
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private List<String> realmRoles; // Change to List<String> to match frontend
        private String password;

        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public List<String> getRealmRoles() { return realmRoles; }
        public void setRealmRoles(List<String> realmRoles) { this.realmRoles = realmRoles; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        // Helper to get the first role
        public String getRole() {
            return (realmRoles != null && !realmRoles.isEmpty()) ? realmRoles.get(0) : null;
        }
    }
}