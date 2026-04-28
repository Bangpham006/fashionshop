package com.iws.fashionshop.service;

import com.iws.fashionshop.model.Cart;
import com.iws.fashionshop.model.Product;
import com.iws.fashionshop.model.ProductVariant;
import com.iws.fashionshop.repository.CartRepository;
import com.iws.fashionshop.repository.ProductRepository;
import com.iws.fashionshop.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductVariantRepository variantRepository;

    public Cart getCartByUserId(String userId) {
        // Kiểm tra an toàn cho userId
        if (userId == null || userId.equals("undefined") || userId.isEmpty()) {
            throw new RuntimeException("User ID không hợp lệ");
        }

        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserId(userId);
                    newCart.setItems(new ArrayList<>());
                    newCart.setTotalPrice(0.0);
                    return cartRepository.save(newCart);
                });
    }

    public Cart addToCart(String userId, String variantId, Integer quantity) {
        try {
            Cart cart = getCartByUserId(userId);

            // 1. Tìm Variant
            ProductVariant variant = variantRepository.findById(variantId)
                    .orElseThrow(() -> new RuntimeException("Variant không tồn tại ID: " + variantId));

            // 2. Tìm Product - Chú ý dùng getProductId().toHexString() để khớp với MongoDB ID
            String productIdStr = variant.getProductId().toHexString();
            Product product = productRepository.findById(productIdStr)
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại ID: " + productIdStr));

            // Đảm bảo danh sách items không null
            if (cart.getItems() == null) {
                cart.setItems(new ArrayList<>());
            }

            // 3. Kiểm tra trùng
            Optional<Cart.CartItem> existingItem = cart.getItems().stream()
                    .filter(item -> item.getVariantId().equals(variantId))
                    .findFirst();

            if (existingItem.isPresent()) {
                Cart.CartItem item = existingItem.get();
                item.setQuantity(item.getQuantity() + (quantity != null ? quantity : 1));
                item.setPrice(variant.getPrice());
            } else {
                Cart.CartItem newItem = new Cart.CartItem();
                newItem.setVariantId(variantId);
                newItem.setQuantity(quantity != null ? quantity : 1);
                newItem.setProductName(product.getName());
                newItem.setPrice(variant.getPrice() != null ? variant.getPrice() : 0.0);
                newItem.setSize(variant.getSize());

                // Xử lý ảnh an toàn
                String imgUrl = "";
                if (variant.getVariantImage() != null && !variant.getVariantImage().isEmpty()) {
                    imgUrl = variant.getVariantImage();
                } else if (product.getImages() != null && !product.getImages().isEmpty()) {
                    imgUrl = product.getImages().get(0);
                }
                newItem.setImage(imgUrl);

                cart.getItems().add(newItem);
            }

            // 4. Tính toán và lưu
            updateCartTotal(cart);
            return cartRepository.save(cart);

        } catch (Exception e) {
            System.err.println("CRITICAL ERROR IN ADD TO CART: " + e.getMessage());
            throw e;
        }
    }

    private void updateCartTotal(Cart cart) {
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            cart.setTotalPrice(0.0);
            return;
        }

        double total = cart.getItems().stream()
                .mapToDouble(item -> {
                    double price = (item.getPrice() != null) ? item.getPrice() : 0.0;
                    int qty = (item.getQuantity() != null) ? item.getQuantity() : 0;
                    return price * qty;
                })
                .sum();

        cart.setTotalPrice(total);
    }

    public Cart removeItemFromCart(String userId, String variantId) {
        Cart cart = getCartByUserId(userId);
        if (cart.getItems() != null) {
            cart.getItems().removeIf(item -> item.getVariantId().equals(variantId));
        }
        updateCartTotal(cart);
        return cartRepository.save(cart);
    }

    public void clearCart(String userId) {
        Cart cart = getCartByUserId(userId);
        cart.setItems(new ArrayList<>());
        cart.setTotalPrice(0.0);
        cartRepository.save(cart);
    }
}