package com.iws.fashionshop.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.iws.fashionshop.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class UserConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. PHẢI CÓ ĐOẠN NÀY ĐỂ CHO PHÉP REACT GỌI API
                .cors(cors -> cors.configurationSource(request -> {
            var cfg = new org.springframework.web.cors.CorsConfiguration();
            cfg.setAllowedOrigins(java.util.List.of("http://localhost:3000"));
            cfg.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            cfg.setAllowedHeaders(java.util.List.of("*"));
            return cfg;
        }))
                .csrf(csrf -> csrf.disable()) // Tắt CSRF để postman có thể test
                .sessionManagement(session -> session.sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS)) // Không dùng session, mỗi request phải có token

                .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // Mở Login/Register cho mọi người
                .requestMatchers("/api/products/**").permitAll() // sua day tam de cho tat ca add san pham da
                .anyRequest().authenticated() // Tất cả cái khác (gồm Product) phải có Token
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // Thêm Filter JWT vào trước filter mặc định của Spring

        return http.build();
    }
}
