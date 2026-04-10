package com.iws.fashionshop.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.Min;
@Data
@Document(collection = "product_variants")
public class ProductVariant {
    @Id
    private String id;
    private String productId; //Kết nối với "Cha" Product

    private String color; // VD: "Black/Volt/White"
    private String size;  // VD: "42", "42.5", "43"
    private Double price; // Giá có thể khác nhau giữa các màu/size đặc biệt

    @Min(0)
    private Integer stock; // CHỐNG LỖI ÂM KHO:

    private String sku; // Mã quản lý kho (VD: NK-PEG40-BLK-42)
    private String variantImage; // Ảnh riêng cho màu này
}