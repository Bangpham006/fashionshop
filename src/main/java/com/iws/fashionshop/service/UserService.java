package com.iws.fashionshop.service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER"); // Mọi user đều có quyền User
        if (user.isAdmin()) {
            roles.add("ROLE_ADMIN");
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
}
