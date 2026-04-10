package com.iws.fashionshop.service;

import com.iws.fashionshop.model.Cart;
import com.iws.fashionshop.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    // 1. Lấy giỏ hàng theo User
    public Cart getCartByUserId(String userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    newCart.setItems(new ArrayList<>()); // Khởi tạo danh sách rỗng
                    return cartRepository.save(newCart);
                });
    }

    // 2. Thêm sản phẩm vào giỏ
    public Cart addToCart(String userId, String variantId, Integer quantity) {
        Cart cart = getCartByUserId(userId);

        // Kiểm tra xem món này đã có trong giỏ chưa
        Optional<Cart.CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getVariantId().equals(variantId))
                .findFirst();

        if (existingItem.isPresent()) {
            // Nếu có rồi thì tăng số lượng
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            // Nếu chưa có thì tạo mới CartItem
            Cart.CartItem newItem = new Cart.CartItem();
            newItem.setVariantId(variantId);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    // 3. Xóa một món khỏi giỏ
    public Cart removeItemFromCart(String userId, String variantId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().removeIf(item -> item.getVariantId().equals(variantId));
        return cartRepository.save(cart);
    }

    // 4. Xóa sạch giỏ hàng (Sau khi thanh toán xong)
    public void clearCart(String userId) {
        Cart cart = getCartByUserId(userId);
        cart.setItems(new ArrayList<>());
        cartRepository.save(cart);
    }
}