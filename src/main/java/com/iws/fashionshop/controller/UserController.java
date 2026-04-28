package com.iws.fashionshop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.iws.fashionshop.dto.ForgotPasswordRequest;
import com.iws.fashionshop.model.User;
import com.iws.fashionshop.security.JwtTokenProvider;
import com.iws.fashionshop.service.UserService;

import lombok.Getter;
import lombok.Setter;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Đảm bảo React có thể gọi API này
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
            // 1. Kiểm tra User/Pass trong MongoDB
            User user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());

            // 2. Nếu đúng, tạo Token
            String jwt = tokenProvider.generateToken(user.getUsername());

            // 3. Trả về LoginResponse kèm theo ID của User
            // Đảm bảo truyền user.getId() vào vị trí thứ 2 của Constructor
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

    /**
     * Lớp LoginResponse được cập nhật để chứa ID người dùng.
     * ID này cực kỳ quan trọng để Frontend (React) dùng cho các chức năng như Giỏ hàng.
     */
    @Getter
    @Setter
    public static class LoginResponse {
        private String token;
        private String id; // ID người dùng từ MongoDB
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