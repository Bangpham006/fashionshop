package com.iws.fashionshop.service;

import com.iws.fashionshop.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    // Đăng ký va Tài khoản
    User register(User user);
    User login(String email, String password);
    User getProfile(String userId);
    User updateProfile(String userId, User userRequest);

    // Bảo mật
    void changePassword(String userId, String oldPassword, String newPassword);

    // Quản trị (Admin)
    List<User> getAllUsers();
    void toggleUserStatus(String userId); // Khóa hoặc mở khóa tài khoản
}