package com.iws.fashionshop.model;


import lombok.Data;

@Data
public class OrderItem {
    private String variantId;   // Link tới kho
    private String sku;         // BẮT BUỘC: Mã định danh sản phẩm vật lý
    private String productName; // Tên SP lúc mua (phòng trường hợp sau này đổi tên SP)
    private String color;
    private String size;
    private String image;       // Ảnh của màu đó lúc mua

    private Double priceAtPurchase; // Giá thực tế lúc khách bấm nút đặt
    private Integer quantity;

    private String itemStatus; // NORMAL, CANCELLED, RETURNED (Dùng cho việc trả 1 phần đơn hàng)
}