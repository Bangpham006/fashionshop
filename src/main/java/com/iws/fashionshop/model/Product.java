package com.iws.fashionshop.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    private String productId;
    @Indexed
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    @Indexed(unique = true)
    private String slug;

    private String description;

    @Indexed
    private String categoryId;

    private String brand;
    private List<String> images;

    @Pattern(regexp = "Male|Female|Unisex")
    private String gender;

    @Pattern(regexp = "Clothe|Shoes|Backpack|Other")
    private String type;

    @Min(value = 0)
    private Double basePrice;

    @Builder.Default
    private boolean isActive = true;
    @Builder.Default
    private boolean isFeatured = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    private List<String> tags;
}
