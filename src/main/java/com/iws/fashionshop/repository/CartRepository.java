package com.iws.fashionshop.repository;

import com.iws.fashionshop.model.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<Cart, String> {
    // Tìm giỏ hàng của một người dùng cụ thể
    Optional<Cart> findByUserId(String userId);
}