package com.iws.fashionshop.repository;

import com.iws.fashionshop.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    // 1. Tìm theo Slug (Dùng cho trang chi tiết sản phẩm)
    // boc voi optional de khong bi quang null
    Optional<Product> findBySlug(String slug);

    // 2. Tìm theo Danh mục + CÓ PHÂN TRANG & SẮP XẾP
    // Pageable ở đây sẽ chứa cả số trang (page), kích thước (size) và tiêu chí sắp xếp (sort)
    Page<Product> findByCategoryIdAndIsActiveTrue(String categoryId, Pageable pageable);

    // 3. Tìm kiếm theo tên + CÓ PHÂN TRANG & SẮP XẾP
    Page<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String name, Pageable pageable);

    // 4. Lọc theo Giới tính + CÓ PHÂN TRANG
    Page<Product> findByGenderAndIsActiveTrue(String gender, Pageable pageable);

    // 5. Lấy danh sách sản phẩm nổi bật (Thường hiện ở trang chủ, có thể không cần phân trang)
    List<Product> findByIsFeaturedTrueAndIsActiveTrue();
    // tim theo brand
    Page<Product> findByBrandAndIsActiveTrue(String brand, Pageable pageable);
    // tim theo brand va gender
    Page<Product> findByBrandAndGenderAndIsActiveTrue(String brand, String gender, Pageable pageable);
    // 6. Kiểm tra xem slug đã tồn tại chưa
    boolean existsBySlug(String slug);
    // 7 Locj theo gioi tinh + loai hang shoes , clothing ,...
    Page<Product> findByCategoryIdAndGenderAndIsActiveTrue(String categoryId, String gender, Pageable pageable);

}
