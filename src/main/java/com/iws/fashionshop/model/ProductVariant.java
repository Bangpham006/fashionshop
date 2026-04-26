package com.iws.fashionshop.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.Min;
import lombok.Data;
import org.bson.types.ObjectId;
@Data
@Document(collection = "product_variants")
public class ProductVariant {
    @Id
    private String id;

    @Field("productId")
    private ObjectId productId; //Kết nối với "Cha" Product

    @Field("color")
    private String color; // VD: "Black/Volt/White"

    @Field("size")
    private String size;  // VD: "42", "42.5", "43"

    @Field("price")
    private Double price; // Giá có thể khác nhau giữa các màu/size đặc biệt

    @Min(0)
    @Field("stock")
    private Integer stock; // CHỐNG LỖI ÂM KHO:

    @Field("sku")
    private String sku; // Mã quản lý kho (VD: NK-PEG40-BLK-42)

    @Field("variantImage")
    private String variantImage; // Ảnh riêng cho màu này
}