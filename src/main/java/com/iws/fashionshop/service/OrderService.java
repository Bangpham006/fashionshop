package com.iws.fashionshop.service;

import com.iws.fashionshop.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    // Cho User
    Order createOrder(String userId, String paymentMethod, String couponCode); // Tạo đơn từ giỏ hàng
    Order getOrderDetail(String orderCode);
    Page<Order> getMyOrders(String userId, int page, int size);
    Order cancelOrder(String orderId, String reason); // Khách hủy đơn

    // Cho Admin
    Page<Order> getAllOrders(Pageable pageable);
    Page<Order> getAllOrders(int page, int size);
    Order updateOrderStatus(String orderId, String status); // Chuyển trạng thái PENDING -> CONFIRMED...
    Order updatePaymentStatus(String orderId, String status);
}