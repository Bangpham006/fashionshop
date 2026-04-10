package com.iws.fashionshop.controller;

import com.iws.fashionshop.model.User;
import com.iws.fashionshop.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // --- AUTHENTICATION & PROFILE ---
    // chinh sua profile cua user // chua can
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return new ResponseEntity<>(userService.register(user), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestParam String email, @RequestParam String password) {
        return ResponseEntity.ok(userService.login(email, password));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getProfile(@PathVariable String userId) {
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateProfile(@PathVariable String userId, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateProfile(userId, user));
    }

    // --- SECURITY ---
    // doi mat khau
    @PutMapping("/{userId}/change-password")
    public ResponseEntity<String> changePassword(
            @PathVariable String userId,
            @RequestParam String oldPassword,
            @RequestParam String newPassword) {
        userService.changePassword(userId, oldPassword, newPassword);
        return ResponseEntity.ok("Đổi mật khẩu thành công!");
    }

    // --- ADMIN ONLY ---
    // lay user
    @GetMapping("/admin/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/admin/{userId}/toggle-status")
    public ResponseEntity<String> toggleStatus(@PathVariable String userId) {
        userService.toggleUserStatus(userId);
        return ResponseEntity.ok("Đã thay đổi trạng thái tài khoản.");
    }
}