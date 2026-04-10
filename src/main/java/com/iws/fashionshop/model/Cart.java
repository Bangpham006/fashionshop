package com.iws.fashionshop.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "carts")
public class Cart {
    @Id
    private String id;

    private String userId; // Mỗi user 1 giỏ

    private List<CartItem> items; // Danh sách món đồ

    // Class phụ để lưu chi tiết từng món trong giỏ
    @Data
    public static class CartItem {
        private String variantId; // Mua size nào, màu nào
        private Integer quantity;
    }
}