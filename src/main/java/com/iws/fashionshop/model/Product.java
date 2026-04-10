package com.iws.fashionshop.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {
    @Id
    private String id;

    @Indexed // Index để tìm kiếm tên nhanh hơn
    private String name;

    @Indexed(unique = true)
    private String slug; // Dùng cho đường dẫn URL đẹp (SEO)

    private String description;

    @Indexed
    private String categoryId;

    private String brand;
    private List<String> images;
    private String gender; // Men, Women, Unisex

    private Double basePrice; // Giá hiển thị "chỉ từ..." ngoài trang chủ

    private List<String> tags; // Ví dụ: ["Running", "Nike Air", "Summer"]

    // RATING
    private Double averageRating = 0.0;
    // CHO PHAN REVIEW
    private Integer totalReviews = 0;

    private boolean isActive = true;
    private boolean isFeatured = false; // Đánh dấu sản phẩm hot/nổi bật

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}