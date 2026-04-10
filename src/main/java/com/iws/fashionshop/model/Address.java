package com.iws.fashionshop.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "addresses")
public class Address {
    @Id
    private String id;
    private String userId; // Link tới User

    private String receiverName;
    private String phone;

    private String province;
    private String district;
    private String ward;
    private String detail;
// dia chi mac dinh
    private boolean isDefault = false;
}