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

            ProductVariant variant = variantRepository.findById(variantId)
                    .orElseThrow(() -> new RuntimeException("Variant không tồn tại ID: " + variantId));

            String productIdStr = variant.getProductId().toHexString();
            Product product = productRepository.findById(productIdStr)
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại ID: " + productIdStr));
            if (cart.getItems() == null) {
                cart.setItems(new ArrayList<>());
            }

            Optional<Cart.CartItem> existingItem = cart.getItems().stream()
                    .filter(item -> item.getVariantId().equals(variantId))
                    .findFirst();

            Double variantPrice = variant.getPrice();
            double safePrice = 0.0;
            if (variantPrice != null) {
                safePrice = variantPrice;
            }

            if (existingItem.isPresent()) {
                Cart.CartItem item = existingItem.get();
                item.setQuantity(item.getQuantity() + (quantity != null ? quantity : 1));
                item.setPrice(safePrice);
            } else {
                Cart.CartItem newItem = new Cart.CartItem();
                newItem.setVariantId(variantId);
                newItem.setQuantity(quantity != null ? quantity : 1);
                newItem.setProductName(product.getName());
                newItem.setPrice(safePrice);
                newItem.setSize(variant.getSize());

                String imgUrl = "";
                if (variant.getVariantImage() != null && !variant.getVariantImage().isEmpty()) {
                    imgUrl = variant.getVariantImage();
                } else if (product.getImages() != null && !product.getImages().isEmpty()) {
                    imgUrl = product.getImages().get(0);
                }
                newItem.setImage(imgUrl);

                cart.getItems().add(newItem);
            }

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
                    Double price = item.getPrice();
                    double priceValue = (price != null) ? price : 0.0;
                    Integer quantity = item.getQuantity();
                    int qty = (quantity != null) ? quantity : 0;
                    return priceValue * qty;
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
