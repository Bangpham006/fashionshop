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
    private ObjectId productId;

    @Field("color")
    private String color;

    @Field("size")
    private String size;

    @Field("price")
    private Double price;

    @Min(0)
    @Field("stock")
    private Integer stock;

    @Field("sku")
    private String sku;

    @Field("variantImage")
    private String variantImage;
}
