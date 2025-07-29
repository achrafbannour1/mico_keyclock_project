package esprit.usergestion.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfig {
  /*  private final UserService userService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req ->
                        req.requestMatchers(
                                        "/auth/**",
                                        "/v2/api-docs",
                                        "/v3/api-docs",
                                        "/v3/api-docs/**",
                                        "/swagger-resources",
                                        "/swagger-resources/**",
                                        "/configuration/ui",
                                        "/configuration/security",
                                        "/swagger-ui/**",
                                        "/webjars/**",
                                        "/swagger-ui.html"
                                )
                                .permitAll()
                                .anyRequest()
                                .authenticated()
                )
                .oauth2ResourceServer(auth ->
                        auth.jwt(token -> token.jwtAuthenticationConverter(new KeycloakJwtAuthenticationConverter(userService))));//userService:for add to the db


        return http.build();
    }
*/
   @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.disable())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> req.anyRequest().permitAll())
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }
    /*
  private final UserService userService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> req
                        // Public endpoints
                        .requestMatchers(
                                "/auth/**",
                                "/v2/api-docs",
                                "/v3/api-docs",
                                "/v3/api-docs/**",
                                "/swagger-resources",
                                "/swagger-resources/**",
                                "/configuration/ui",
                                "/configuration/security",
                                "/swagger-ui/**",
                                "/webjars/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        // Admin-specific endpoints (e.g., add, update resources)
                        .requestMatchers("/resource/addresource", "/resource/updateresource").hasRole("ADMIN")
                        // Shared resource endpoints for ADMIN and MANAGER
                        .requestMatchers("/resource/**").hasAnyRole("ADMIN", "MANAGER")
                        // Manager-specific endpoints (if any)
                        .requestMatchers("/manager/**").hasRole("MANAGER")
                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(auth ->
                        auth.jwt(token ->
                                token.jwtAuthenticationConverter(new KeycloakJwtAuthenticationConverter(userService))
                        )
                );

        return http.build();
    }*/
/*
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
      http
              .cors(withDefaults())
              .csrf(AbstractHttpConfigurer::disable)
              .authorizeHttpRequests(req -> req
                      // Public endpoints
                      .requestMatchers(
                              "/auth/**",
                              "/v2/api-docs",
                              "/v3/api-docs",
                              "/v3/api-docs/**",
                              "/swagger-resources",
                              "/swagger-resources/**",
                              "/configuration/ui",
                              "/configuration/security",
                              "/swagger-ui/**",
                              "/webjars/**",
                              "/swagger-ui.html"
                      ).permitAll()

                      // Admin-specific endpoints (e.g., user management, add/update resources)
                      .requestMatchers("/resource/addresource", "/resource/updateresource").hasRole("ADMIN")
                      // Allow ADMIN and MANAGER to access /keycloak/user/**
                      .requestMatchers("/keycloak/user/**").hasAnyRole("ADMIN", "MANAGER")
                      // Shared resource endpoints for ADMIN and MANAGER
                      .requestMatchers("/resource/**").hasAnyRole("ADMIN", "MANAGER")
                      // Manager-specific endpoints
                      .requestMatchers("/manager/**").hasRole("MANAGER")
                      // All other requests require authentication
                      .anyRequest().authenticated()
              )
              .oauth2ResourceServer(auth ->
                      auth.jwt(token ->
                              token.jwtAuthenticationConverter(new KeycloakJwtAuthenticationConverter())
                      )
              );

      return http.build();
  }
*/
}
