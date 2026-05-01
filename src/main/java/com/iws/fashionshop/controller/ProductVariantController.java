package com.iws.fashionshop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.iws.fashionshop.model.ProductVariant;
import com.iws.fashionshop.service.ProductVariantService;

@RestController
@RequestMapping("/api/variants")
public class ProductVariantController {

    @Autowired
    private ProductVariantService variantService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductVariant> addVariant(@RequestBody ProductVariant variant) {
        ProductVariant created = variantService.addVariant(variant);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductVariant> updateVariant(@PathVariable String id, @RequestBody ProductVariant variant) {
        return ResponseEntity.ok(variantService.updateVariant(id, variant));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVariant(@PathVariable String id) {
        variantService.deleteVariant(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductVariant>> getByProductId(@PathVariable String productId) {
        return ResponseEntity.ok(variantService.getVariantsByProductId(productId));
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<ProductVariant> getBySku(@PathVariable String sku) {
        return ResponseEntity.ok(variantService.getVariantBySku(sku));
    }

    @PutMapping("/{id}/add-stock")
    public ResponseEntity<String> addStock(@PathVariable String id, @RequestParam int amount) {
        variantService.addStock(id, amount);
        return ResponseEntity.ok("Đã nhập thêm " + amount + " sản phẩm vào kho.");
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductVariant>> getLowStock(@RequestParam(defaultValue = "10") int threshold) {
        return ResponseEntity.ok(variantService.getLowStockAlert(threshold));
    }
}
