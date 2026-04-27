package com.iws.fashionshop.service;

import com.iws.fashionshop.model.ProductVariant;
import com.iws.fashionshop.repository.ProductVariantRepository;
import org.bson.types.ObjectId; // import object id
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductVariantServiceImpl implements ProductVariantService {

    @Autowired
    private ProductVariantRepository variantRepository;

    @Override
    public ProductVariant addVariant(ProductVariant variant) {
        if (variantRepository.findBySku(variant.getSku()).isPresent()) {
            throw new RuntimeException("Mã SKU " + variant.getSku() + " đã tồn tại trên hệ thống!");
        }
        return variantRepository.save(variant);
    }

    @Override
    public ProductVariant updateVariant(String id, ProductVariant variantReq) {
        ProductVariant existing = variantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy biến thể để cập nhật"));

        existing.setColor(variantReq.getColor());
        existing.setSize(variantReq.getSize());
        existing.setPrice(variantReq.getPrice());
        existing.setStock(variantReq.getStock());
        existing.setSku(variantReq.getSku());
        existing.setVariantImage(variantReq.getVariantImage());

        return variantRepository.save(existing);
    }

    @Override
    @Transactional
    public void addStock(String variantId, int amount) {
        if (amount <= 0) throw new RuntimeException("Số lượng nhập kho phải lớn hơn 0");

        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Biến thể không tồn tại"));

        variant.setStock(variant.getStock() + amount);
        variantRepository.save(variant);
    }

    @Override
    @Transactional
    public void reduceStock(String variantId, int amount) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Biến thể không tồn tại"));

        if (variant.getStock() < amount) {
            throw new RuntimeException("Kho không đủ hàng! Hiện còn: " + variant.getStock());
        }

        variant.setStock(variant.getStock() - amount);
        variantRepository.save(variant);
    }


    @Override
    public List<ProductVariant> getVariantsByProductId(String productId) {
        try {
            // Ép kiểu chuỗi ID thành ObjectId của MongoDB
            ObjectId objId = new ObjectId(productId);
            return variantRepository.findByProductId(objId);
        } catch (IllegalArgumentException e) {
            // Trả về danh sách rỗng nếu ID truyền lên không hợp lệ (tránh crash web)
            return List.of();
        }
    }

    @Override
    public ProductVariant getVariantBySku(String sku) {
        return variantRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy SKU: " + sku));
    }

    @Override
    public List<ProductVariant> getLowStockAlert(int threshold) {
        return variantRepository.findByStockLessThan(threshold);
    }

    @Override
    public ProductVariant getVariantById(String id) {
        return variantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ID biến thể không hợp lệ"));
    }

    @Override
    public void deleteVariant(String id) {
        variantRepository.deleteById(id);
    }
}