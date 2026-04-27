package com.iws.fashionshop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.iws.fashionshop.model.ProductVariant;
import org.bson.types.ObjectId;

@Repository
public interface ProductVariantRepository extends MongoRepository<ProductVariant, String> {
    // Lấy tất cả Size/Màu của 1 đôi giày cụ thể
    List<ProductVariant> findByProductId(ObjectId productId);

    // Tìm chính xác bằng mã SKU (Mã vạch/Mã định danh vật lý)
    Optional<ProductVariant> findBySku(String sku);

    // Tìm các biến thể sắp hết hàng (Ví dụ: stock < 5) để báo Admin nhập thêm
    List<ProductVariant> findByStockLessThan(Integer threshold);
}