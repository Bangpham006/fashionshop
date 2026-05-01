package com.iws.fashionshop.service;

import com.iws.fashionshop.model.ProductVariant;
import java.util.List;

public interface ProductVariantService {

    ProductVariant addVariant(ProductVariant variant);

    ProductVariant updateVariant(String id, ProductVariant variant);

    void deleteVariant(String id);

    List<ProductVariant> getVariantsByProductId(String productId);

    ProductVariant getVariantById(String id);

    ProductVariant getVariantBySku(String sku);

    void addStock(String variantId, int amount);

    void reduceStock(String variantId, int amount);

    List<ProductVariant> getLowStockAlert(int threshold);
}
