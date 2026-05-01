package com.iws.fashionshop.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "carts")
public class Cart {

    @Id
    private String id;

    private String userId;
    private List<CartItem> items;
    private Double totalPrice;

    @Data
    public static class CartItem {

        private String variantId;
        private Integer quantity;
        private String productName;
        private String image;
        private String size;
        private Double price;
    }
}
