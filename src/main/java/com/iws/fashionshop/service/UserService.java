package com.iws.fashionshop.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.iws.fashionshop.dto.ForgotPasswordRequest;
import com.iws.fashionshop.model.User;
import com.iws.fashionshop.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        // Cảnh báo tên đã tồn tại khi đăng ký
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }

        // Mã hóa mật khẩu
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        String roles = "ROLE_USER"; // Mặc định mọi user đều có quyền User
        if (user.isAdmin()) {
            roles = "ROLE_ADMIN";
        }
        user.setRoles(roles);

        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsernameIgnoreCase(username);
    }

    public User login(String username, String rawPassword) {
        // 1. Tìm user trong DB (không phân biệt hoa thường)
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new RuntimeException("Tên đăng nhập không tồn tại!"));

        // 2. Kiểm tra mật khẩu
        // Lưu ý: Không dùng password.equals() vì một bên là chữ thường, một bên đã mã hóa
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Mật khẩu không chính xác!");
        }

        return user;
    }

    public boolean resetPassword(ForgotPasswordRequest request) {
        return userRepository.findByUsernameIgnoreCase(request.getUsername())
                .map(user -> {
                    if (user.getEmail() != null && user.getEmail().equalsIgnoreCase(request.getEmail())) {
                        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                        userRepository.save(user);
                        return true;
                    }
                    return false;
                }).orElse(false);
    }
}
