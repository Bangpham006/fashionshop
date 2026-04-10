package com.iws.fashionshop.repository;

import com.iws.fashionshop.model.ProductVariant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends MongoRepository<ProductVariant, String> {
    // Lấy tất cả Size/Màu của 1 đôi giày cụ thể
    List<ProductVariant> findByProductId(String productId);

    // Tìm chính xác bằng mã SKU (Mã vạch/Mã định danh vật lý)
    Optional<ProductVariant> findBySku(String sku);

    // Tìm các biến thể sắp hết hàng (Ví dụ: stock < 5) để báo Admin nhập thêm
    List<ProductVariant> findByStockLessThan(Integer threshold);
}