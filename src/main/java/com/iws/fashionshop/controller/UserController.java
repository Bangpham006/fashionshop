package com.iws.fashionshop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.iws.fashionshop.model.User;
import com.iws.fashionshop.service.UserService;
import com.iws.fashionshop.security.JwtTokenProvider;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok("Registration successful for user: " + registeredUser.getUsername());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        try {
            // 1. Kiểm tra User/Pass trong MongoDB
            User user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());

            // 2. Nếu đúng, tạo Token
            String jwt = tokenProvider.generateToken(user.getUsername());

            // 3. Trả về Token cho Postman
            return ResponseEntity.ok(new LoginResponse(jwt));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    // Lớp phụ để định dạng JSON trả về
    class LoginResponse {

        private String accessToken;
        private final String tokenType = "Bearer";

        public LoginResponse(String accessToken) {
            this.accessToken = accessToken;
        }

        public String getAccessToken() {
            return accessToken;
        }

        public void setAccessToken(String accessToken) {
            this.accessToken = accessToken;
        }

        public String getTokenType() {
            return tokenType;
        }
    }
}
