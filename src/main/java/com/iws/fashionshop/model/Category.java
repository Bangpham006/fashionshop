package com.iws.fashionshop.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "categories")
public class Category {
    @Id
    private String id;

    @Indexed(unique = true)
    private String name; // Ví dụ: Giày Chạy Bộ

    @Indexed(unique = true)
    private String slug; // Ví dụ: giay-chay-bo (Dùng cho URL)

    private String description;

    private String parentId; // ID của danh mục cha (Men > Shoes)

    private Integer level; // 1: Gốc san pham , 2: Con shoes / clothes, 3:

    private String path; // Lưu dạng: /men/shoes để tìm kiếm phân cấp nhanh

    private Integer displayOrder = 0; // Thứ tự hiển thị trên Menu

    private Boolean active = true ;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}