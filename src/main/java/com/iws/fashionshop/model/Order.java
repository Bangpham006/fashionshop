package com.iws.fashionshop.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "orders")
public class Order {
    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed(unique = true)
    private String orderCode; // VD: #NIKE-20260407-XXXX

    private Double subTotal;       // Tổng tiền hàng (chưa giảm)
    private Double shippingFee;    // Phí vận chuyển
    private String couponCode;     // Lưu mã để làm Marketing Report
    private Double discountAmount; // Số tiền được giảm
    private Double totalAmount;    // Số tiền khách THỰC TRẢ

    // --- TRẠNG THÁI  ---
    private String orderStatus;    // PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED, RETURNED
    private String paymentStatus;  // UNPAID, PAID, REFUNDED
    private String paymentMethod;  // COD, VNPAY, MOMO, STRIPE


    // --- CHI TIẾT SẢN PHẨM ---
    private List<OrderItem> items;

    // --- AUDIT LOG ---
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}