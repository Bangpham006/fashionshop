package com.iws.fashionshop.user.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) //Disable CSRF for Postman testing

                .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() //Allow unauthenticated user to register
                .anyRequest().authenticated() //Require authentication for other requests
                )
                .formLogin(form -> form.disable()) //Prevent changing to login page
                .httpBasic(basic -> basic.disable()); //Prevent showing login popup in browser

        return http.build();
    }
}
