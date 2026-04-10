package com.iws.fashionshop.controller;

import com.iws.fashionshop.model.Cart;
import com.iws.fashionshop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * CartController: Tầng giao diện API xử lý các yêu cầu liên quan đến Giỏ hàng.
 * Chịu trách nhiệm tiếp nhận HTTP Request và phản hồi dữ liệu JSON cho Client (Postman/Frontend).
 */
@RestController
@RequestMapping("/api/cart") // Đường dẫn gốc: http://localhost:8080/api/cart
public class CartController {

    @Autowired
    private CartService cartService;

    /**
     * 1. LẤY GIỎ HÀNG (READ)
     * Mục tiêu: Khi User vào trang Giỏ hàng, hệ thống cần load danh sách món đồ họ đã chọn.
     * @param userId: ID của người dùng (lấy từ Path Variable)
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable String userId) {
        // Bước 1: Gọi Service để tìm giỏ hàng.
        // Bước 2: Nếu Service trả về dữ liệu, bọc nó trong ResponseEntity với Status 200 OK.
        Cart cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }


    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @RequestParam String userId,
            @RequestParam String variantId,
            @RequestParam Integer quantity) {

        // Bước 1: Chuyển dữ liệu xuống Service xử lý logic kiểm tra trùng lặp (Logic này đã viết ở CartService).
        // Bước 2: Nhận lại đối tượng Cart đã được cập nhật sau khi lưu vào MongoDB.
        Cart updatedCart = cartService.addToCart(userId, variantId, quantity);

        // Bước 3: Trả về kết quả cho Client thấy giỏ hàng mới nhất.
        return ResponseEntity.ok(updatedCart);
    }

    /**
     * 3. XÓA MỘT MÓN KHỎI GIỎ (DELETE ITEM)
     */
    @DeleteMapping("/remove")
    public ResponseEntity<Cart> removeItem(
            @RequestParam String userId,
            @RequestParam String variantId) {

        // Bước 1: Gọi hàm xóa item dựa trên variantId trong danh sách items của User đó.
        Cart updatedCart = cartService.removeItemFromCart(userId, variantId);
        return ResponseEntity.ok(updatedCart);
    }

    /**
     * 4. LÀM TRỐNG GIỎ HÀNG
     * Dùng sau khi khách đã đặt hàng thành công
     */
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<String> clearCart(@PathVariable String userId) {
        // Bước 1: Gọi Service xóa sạch mảng items trong Document Cart.
        cartService.clearCart(userId);

        // Bước 2: Trả về thông báo thành công
        return ResponseEntity.ok("Giỏ hàng của người dùng " + userId + " đã được làm trống.");
    }
}