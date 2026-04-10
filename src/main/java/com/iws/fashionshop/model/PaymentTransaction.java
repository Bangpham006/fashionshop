package com.iws.fashionshop.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "payment_transactions")
public class PaymentTransaction {
    @Id
    private String id;
    private String orderId;
    private String transactionId; // Mã từ ngân hàng trả về
    private Double amount;
    private String status;        // SUCCESS, FAILED
    private String provider;      // VNPAY, MOMO
    private LocalDateTime createdAt = LocalDateTime.now();
}