/*package tn.esprit.springproject.security;


import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import static java.util.stream.Collectors.toSet;
public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {
    @Override
    public AbstractAuthenticationToken convert(Jwt source) {
        return new JwtAuthenticationToken(
                source,
                Stream.concat(
                                new JwtGrantedAuthoritiesConverter().convert(source).stream(),
                                extractResourceRoles(source).stream())
                        .collect(toSet()));
    }
    private Collection<? extends GrantedAuthority> extractResourceRoles(Jwt jwt) {
        var resourceAccess = new HashMap<>(jwt.getClaim("resource_access"));

        var eternal = (Map<String, List<String>>) resourceAccess.get("account");

        var roles = eternal.get("roles");

        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.replace("-", "_")))
                .collect(toSet());
    }}
*/
package esprit.usergestion.security;

import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;


import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {
/*
    private final UserService userService;

    @Override
    public AbstractAuthenticationToken convert(@NonNull Jwt jwt) {
        // Register user if not in database
        userService.registerUserFromJwt(jwt);

        return new JwtAuthenticationToken(
                jwt,
                Stream.concat(
                        extractAuthorities(jwt).stream(),
                        extractResourceRoles(jwt).stream()
                ).collect(toSet())
        );
    }

    private Collection<? extends GrantedAuthority> extractAuthorities(Jwt jwt) {
        return new org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter().convert(jwt);
    }

    private Collection<? extends GrantedAuthority> extractResourceRoles(Jwt jwt) {
        return jwt.getClaimAsStringList("realm_access").stream()
                .map(role -> new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role))
                .collect(toSet());
    }*/
/*
    private final UserService userService;

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        userService.registerUserFromJwt(jwt); // Register user if not in DB

        JwtGrantedAuthoritiesConverter defaultConverter = new JwtGrantedAuthoritiesConverter();
        Collection<GrantedAuthority> defaultAuthorities = defaultConverter.convert(jwt);

        Collection<GrantedAuthority> keycloakAuthorities = (Collection<GrantedAuthority>) extractKeycloakRoles(jwt);

        return new JwtAuthenticationToken(
                jwt,
                Stream.concat(defaultAuthorities.stream(), keycloakAuthorities.stream())
                        .collect(Collectors.toSet())
        );
    }

    private Collection<? extends GrantedAuthority> extractKeycloakRoles(Jwt jwt) {
        Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
        if (realmAccess == null || !realmAccess.containsKey("roles")) {
            return Collections.emptyList();
        }

        @SuppressWarnings("unchecked")
        List<String> roles = (List<String>) realmAccess.get("roles");
        if (roles == null) {
            return Collections.emptyList();
        }

        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role)) // Keep Keycloak case (ADMIN, MANAGER)
                .collect(Collectors.toSet());
    }
*/
@Override
public AbstractAuthenticationToken convert(Jwt jwt) {
    Collection<GrantedAuthority> keycloakAuthorities = (Collection<GrantedAuthority>) extractKeycloakRoles(jwt);

    return new JwtAuthenticationToken(
            jwt,
            keycloakAuthorities
    );
}

    private Collection<? extends GrantedAuthority> extractKeycloakRoles(Jwt jwt) {
        Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
        if (realmAccess == null || !realmAccess.containsKey("roles")) {
            return Collections.emptyList();
        }

        @SuppressWarnings("unchecked")
        List<String> roles = (List<String>) realmAccess.get("roles");
        if (roles == null) {
            return Collections.emptyList();
        }

        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())) // Ensure uppercase and ROLE_ prefix
                .collect(Collectors.toSet());
    }

}
