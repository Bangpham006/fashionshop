package com.iws.fashionshop.repository;

import com.iws.fashionshop.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    // 1. Tìm danh mục bằng Slug (Dùng cho đường dẫn URL: /giay-nam)
    Optional<Category> findBySlug(String slug);

    // 2. Tìm tất cả danh mục con của một danh mục cha nào đó
    List<Category> findByParentId(String parentId);

    // 3. Tìm danh mục theo cấp độ (VD: Level 1 là Men/Women, Level 2 là Shoes/Clothes)
    List<Category> findByLevel(Integer level);

    // 4. Kiểm tra xem Slug đã tồn tại chưa (Để tránh trùng lặp URL)
    boolean existsBySlug(String slug);

    // 5. Tìm các danh mục đang hoạt động (isActive = true)
    // test
    // List<Category> findByIsActiveTrue();
}