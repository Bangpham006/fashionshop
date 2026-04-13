package com.iws.fashionshop.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.iws.fashionshop.security.JwtAuthenticationFilter;

@Configuration
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
                .csrf(csrf -> csrf.disable()) // Tắt CSRF để postman có thể test
                .sessionManagement(session -> session.sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS)) // Không dùng session, mỗi request phải có token

                .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // Mở Login/Register cho mọi người
                .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN") // Chỉ ADMIN mới được tạo sản phẩm
                .anyRequest().authenticated() // Tất cả cái khác (gồm Product) phải có Token
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // Thêm Filter JWT vào trước filter mặc định của Spring

        return http.build();
    }
}
