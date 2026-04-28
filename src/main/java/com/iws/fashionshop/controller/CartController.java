package com.iws.fashionshop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.iws.fashionshop.model.Cart;
import com.iws.fashionshop.service.CartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000") // Cụ thể cổng của React
public class CartController {

    @Autowired
    private CartService cartService;

    // 1. LẤY GIỎ HÀNG (Giữ nguyên vì dùng PathVariable là đúng rồi)
    @GetMapping("/user/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable String userId) {
        Cart cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }

    // 2. THÊM VÀO GIỎ HÀNG (Sửa thành RequestParam để khớp với React)
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestParam String userId,
            @RequestParam String variantId,
            @RequestParam(defaultValue = "1") int quantity) {

        // Chặn lỗi ID rác
        if (userId == null || "undefined".equals(userId) || userId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User ID không hợp lệ!");
        }

        try {
            Cart updatedCart = cartService.addToCart(userId, variantId, quantity);
            return ResponseEntity.ok(updatedCart);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi Backend: " + e.getMessage());
        }
    }

    // 3. XÓA MÓN
    @DeleteMapping("/remove")
    public ResponseEntity<Cart> removeItem(
            @RequestParam String userId,
            @RequestParam String variantId) {
        Cart updatedCart = cartService.removeItemFromCart(userId, variantId);
        return ResponseEntity.ok(updatedCart);
    }

    // 4. LÀM TRỐNG GIỎ HÀNG
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<String> clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart cleared successfully");
    }
}