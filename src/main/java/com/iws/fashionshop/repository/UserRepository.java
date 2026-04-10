package com.iws.fashionshop.repository;

import com.iws.fashionshop.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // Tìm người dùng bằng email để đăng nhập
    Optional<User> findByEmail(String email);

    // Kiểm tra email đã tồn tại chưa (để báo lỗi khi đăng ký trùng)
    boolean existsByEmail(String email);
}