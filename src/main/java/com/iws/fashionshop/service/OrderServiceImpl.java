package com.iws.fashionshop.service;

import com.iws.fashionshop.model.Order;
import com.iws.fashionshop.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;


@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductVariantService variantService;

    @Override
    public Order createOrder(String userId, String paymentMethod, String couponCode) {
        // BƯỚC 1: Lấy giỏ hàng của User (Giả lập logic vì bạn chưa gửi CartService)
        // Trong thực tế: Cart cart = cartService.getCartByUserId(userId);

        // BƯỚC 2: Tính toán tiền bạc
        double subTotal = 500000; // Ví dụ tổng tiền
        double shippingFee = 30000;
        double discount = 0; // Nếu có couponCode thì tính ở đây
        double totalAmount = subTotal + shippingFee - discount;

        // BƯỚC 3: Tạo mã đơn hàng duy nhất (VD: OD-123456)
        String orderCode = "OD-" + System.currentTimeMillis() % 1000000;

        // BƯỚC 4: Tạo đối tượng Order
        Order order = Order.builder()
                .userId(userId)
                .orderCode(orderCode)
                .subTotal(subTotal)
                .shippingFee(shippingFee)
                .totalAmount(totalAmount)
                .paymentMethod(paymentMethod)
                .orderStatus("PENDING")   // Đơn hàng mới luôn là PENDING
                .paymentStatus("UNPAID")  // Mặc định chưa thanh toán
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // BƯỚC 5: Trừ kho (Quan trọng!)
        // Lặp qua danh sách items trong giỏ hàng và gọi variantService.reduceStock
        // for(OrderItem item : items) { variantService.reduceStock(item.getVariantId(), item.getQuantity()); }

        return orderRepository.save(order);
    }

    @Override
    public Order getOrderDetail(String orderCode) {
        return orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng: " + orderCode));
    }

    @Override
    public Page<Order> getMyOrders(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return orderRepository.findByUserId(userId, pageable);
    }

    @Override
    public Order cancelOrder(String orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        // Chỉ được hủy khi đơn đang ở trạng thái PENDING hoặc CONFIRMED
        if (order.getOrderStatus().equals("SHIPPED") || order.getOrderStatus().equals("DELIVERED")) {
            throw new RuntimeException("Đơn hàng đang giao hoặc đã nhận, không thể hủy!");
        }

        order.setOrderStatus("CANCELLED");
        order.setUpdatedAt(LocalDateTime.now());

        // Logic phụ: Hoàn lại kho hàng (AddStock) nếu cần thiết ở đây

        return orderRepository.save(order);
    }

    @Override
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    @Override
    public Page<Order> getAllOrders(int page, int size) {
        return orderRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @Override
    public Order updateOrderStatus(String orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        order.setOrderStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Override
    public Order updatePaymentStatus(String orderId, String status) {
        // Bước 1: Tìm đơn hàng trong Database bằng ID
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));

        // Bước 2: Cập nhật trạng thái thanh toán (ví dụ: "PAID", "UNPAID")
        existingOrder.setPaymentStatus(status);

        // Bước 3: Cập nhật ngày chỉnh sửa cuối cùng
        existingOrder.setUpdatedAt(LocalDateTime.now());

        // Bước 4: Lưu lại vào Database
        return orderRepository.save(existingOrder);
    }
}