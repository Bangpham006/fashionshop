package com.iws.fashionshop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.iws.fashionshop.model.Product;
import com.iws.fashionshop.service.ProductService;

@RestController// giup du lieu tra ve tu cac ham bien thanh json
// dinh nghia duong dan goc cho api
@RequestMapping("/api/products")

public class ProductController {
// tim va nap oj seevice de xu ly
    @Autowired
    private ProductService productService;

    @GetMapping("/filter")
    public ResponseEntity<Page<Product>> getFilteredProducts(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String gender,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        // lay du lieu va gui ve truỳen ve cho service su ly sau do chuyen lai cho fontend
        return ResponseEntity.ok(productService.getFilteredProducts(categoryId, gender, page, size, sortBy, sortDir));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Product>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(productService.searchProducts(keyword, page, size, sortBy, sortDir));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Product>> getFeatured() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }

    @GetMapping("/slug/{slug}")
    // lay gia tri truc tiep tu duong dan
    public ResponseEntity<Product> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    @PostMapping("")
    // dung cho admin rbody nhan ca 1 json admin nhap
    public ResponseEntity<Product> create(@RequestBody Product product) {
        Product savedProduct = productService.createProduct(product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable String id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
