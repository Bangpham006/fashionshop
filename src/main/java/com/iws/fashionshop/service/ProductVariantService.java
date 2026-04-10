package com.iws.fashionshop.service;

import com.iws.fashionshop.model.ProductVariant;
import java.util.List;

public interface ProductVariantService {
    // Quản lý biến thể (Admin)
    ProductVariant addVariant(ProductVariant variant);
    ProductVariant updateVariant(String id, ProductVariant variant);
    void deleteVariant(String id);

    // Truy vấn dữ liệu
    List<ProductVariant> getVariantsByProductId(String productId);
    ProductVariant getVariantById(String id);
    ProductVariant getVariantBySku(String sku);

    // Quản lý Kho hàng (admin)
    void addStock(String variantId, int amount);      // Nhập thêm hàng
    void reduceStock(String variantId, int amount);   // Xuất hàng (bán hàng)
    List<ProductVariant> getLowStockAlert(int threshold); // Cảnh báo hàng sắp hết
}