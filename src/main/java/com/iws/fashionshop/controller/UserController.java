package com.iws.fashionshop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.iws.fashionshop.dto.ForgotPasswordRequest;
import com.iws.fashionshop.model.User;
import com.iws.fashionshop.security.JwtTokenProvider;
import com.iws.fashionshop.service.UserService;

import lombok.Getter;
import lombok.Setter;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok("Registration successful for user: " + registeredUser.getUsername());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        boolean isReset = userService.resetPassword(request);
        if (isReset) {
            return ResponseEntity.ok("Mật khẩu đã được thay đổi thành công!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Username hoặc Email không chính xác!");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        try {
            User user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
            String jwt = tokenProvider.generateToken(user.getUsername(), user.getRoles());
            return ResponseEntity.ok(new LoginResponse(
                    jwt,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRoles()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @Getter
    @Setter
    public static class LoginResponse {

        private String token;
        private String id;
        private String type = "Bearer";
        private String username;
        private String email;
        private String roles;

        public LoginResponse(String accessToken, String id, String username, String email, String roles) {
            this.token = accessToken;
            this.id = id;
            this.username = username;
            this.email = email;
            this.roles = roles;
        }
    }
}
