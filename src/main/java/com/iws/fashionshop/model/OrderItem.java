package com.iws.fashionshop.model;

import lombok.Data;

@Data
public class OrderItem {

    private String variantId;
    private String sku;
    private String productName;
    private String color;
    private String size;
    private String image;

    private Double priceAtPurchase;
    private Integer quantity;

    private String itemStatus;
}
