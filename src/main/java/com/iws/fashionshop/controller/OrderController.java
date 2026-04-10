package com.iws.fashionshop.controller;

import com.iws.fashionshop.model.Order;
import com.iws.fashionshop.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // --- DÀNH CHO USER ---

    // 1. Tạo đơn hàng mới
    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestParam String userId,
            @RequestParam String paymentMethod,
            // chua dung coupon
            @RequestParam(required = false) String couponCode) {
        return new ResponseEntity<>(orderService.createOrder(userId, paymentMethod, couponCode), HttpStatus.CREATED);
    }

    // 2. Tra cứu chi tiết đơn hàng qua mã Code (ví dụ khách check đơn)
    @GetMapping("/{orderCode}")
    public ResponseEntity<Order> getOrderDetail(@PathVariable String orderCode) {
        return ResponseEntity.ok(orderService.getOrderDetail(orderCode));
    }

    // 3. Xem lịch sử đơn hàng của bản thân (Phân trang)
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Order>> getMyOrders(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(orderService.getMyOrders(userId, page, size));
    }

    // 4. Khách hàng hủy đơn
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(
            @PathVariable String orderId,
            @RequestParam String reason) {
        return ResponseEntity.ok(orderService.cancelOrder(orderId, reason));
    }

    // --- DÀNH CHO ADMIN ---

    // 5. Lấy toàn bộ danh sách đơn hàng (Cho Admin quản lý)
    @GetMapping
    public ResponseEntity<Page<Order>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(orderService.getAllOrders(page, size));
    }

    // 6. Cập nhật trạng thái đơn hàng (PENDING -> CONFIRMED -> SHIPPED...)
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateStatus(
            @PathVariable String orderId,
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    // 7. Cập nhật trạng thái thanh toán (PAID/UNPAID)
    @PutMapping("/{orderId}/payment")
    public ResponseEntity<Order> updatePaymentStatus(
            @PathVariable String orderId,
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updatePaymentStatus(orderId, status));
    }
}