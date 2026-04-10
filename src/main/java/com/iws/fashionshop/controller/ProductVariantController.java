package com.iws.fashionshop.controller;

import com.iws.fashionshop.model.ProductVariant;
import com.iws.fashionshop.service.ProductVariantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/variants")
public class ProductVariantController {

    @Autowired
    private ProductVariantService variantService;

    // --- 1. QUẢN LÝ BIẾN THỂ (ADMIN) ---

    // Thêm mới biến thể (Ví dụ: Lần đầu nhập Size 42 cho giày Nike)
    @PostMapping
    public ResponseEntity<ProductVariant> addVariant(@RequestBody ProductVariant variant) {
        ProductVariant created = variantService.addVariant(variant);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Cập nhật thông tin (Đổi giá, đổi SKU...)
    @PutMapping("/{id}")
    public ResponseEntity<ProductVariant> updateVariant(@PathVariable String id, @RequestBody ProductVariant variant) {
        return ResponseEntity.ok(variantService.updateVariant(id, variant));
    }

    // Xóa biến thể khỏi hệ thống
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVariant(@PathVariable String id) {
        variantService.deleteVariant(id);
        return ResponseEntity.noContent().build();
    }

    // --- 2. TRUY VẤN DỮ LIỆU ---

    // Lấy tất cả các Size/Màu của một sản phẩm (Dùng để hiện lên trang chủ/chi tiết)
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductVariant>> getByProductId(@PathVariable String productId) {
        return ResponseEntity.ok(variantService.getVariantsByProductId(productId));
    }

    // Tìm nhanh biến thể theo mã SKU
    @GetMapping("/sku/{sku}")
    public ResponseEntity<ProductVariant> getBySku(@PathVariable String sku) {
        return ResponseEntity.ok(variantService.getVariantBySku(sku));
    }

    // --- 3. QUẢN LÝ KHO HÀNG (STOCK) ---

    // Nhập thêm hàng
    @PutMapping("/{id}/add-stock")
    public ResponseEntity<String> addStock(@PathVariable String id, @RequestParam int amount) {
        variantService.addStock(id, amount);
        return ResponseEntity.ok("Đã nhập thêm " + amount + " sản phẩm vào kho.");
    }

    // Xuất kho khi bán hàng (Giảm số lượng)
    @PutMapping("/{id}/reduce-stock")
    public ResponseEntity<String> reduceStock(@PathVariable String id, @RequestParam int amount) {
        variantService.reduceStock(id, amount);
        return ResponseEntity.ok("Đã xuất " + amount + " sản phẩm khỏi kho.");
    }

    // Cảnh báo hàng sắp hết (threshold là ngưỡng, ví dụ dưới 5 cái thì báo)
    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductVariant>> getLowStock(@RequestParam(defaultValue = "10") int threshold) {
        return ResponseEntity.ok(variantService.getLowStockAlert(threshold));
    }
}