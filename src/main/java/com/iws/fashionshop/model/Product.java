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
    private String productId; // Không thêm vào khi test Postman, MongoDB tự tạo ID này

    @Indexed // Index để tìm kiếm tên nhanh hơn
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    @Indexed(unique = true)
    private String slug; // Dùng cho đường dẫn URL đẹp (SEO)

    private String description;

    @Indexed
    private String categoryId;

    private String brand;
    private List<String> images;

    @Pattern(regexp = "Male|Female|Unisex")
    private String gender; // Chỉ có thể chọn "Male", "Female" và "Unisex", dùng để sau này làm filter

    @Pattern(regexp = "Clothe|Shoes|Backpack|Other")
    private String type; // Chỉ có thể chọn "CLothe", "Shoe", "Backpack" và "Other", dùng để sau này làm filter

    @Min(value = 0)
    private Double basePrice; // Giá hiển thị "chỉ từ..." ngoài trang chủ

    // RATING
    @Builder.Default
    private Double averageRating = 0.0;
    // CHO PHAN REVIEW
    @Builder.Default
    private Integer totalReviews = 0;

    @Builder.Default
    private boolean isActive = true;
    @Builder.Default
    private boolean isFeatured = false; // Đánh dấu sản phẩm hot/nổi bật

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
