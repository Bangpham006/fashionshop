package com.iws.fashionshop.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.iws.fashionshop.model.Product;

public interface ProductService {

    // 1. QUẢN LÝ (Dành cho Admin)
    Product createProduct(Product product);

    Product updateProduct(String id, Product product);

    void deleteProduct(String id); // Xóa mềm (set isActive = false)


    // 2. HIỂN THỊ (Dành cho User - Navbar & Shop)

    // Tìm 1 sản phẩm cụ thể
    Product getProductById(String id);
    Product getProductBySlug(String slug);

    //  Lọc tổng hợp
    // Cho phép lọc theo: Category, Giới tính,
    Page<Product> getFilteredProducts(String categoryId, String gender, int page, int size, String sortBy, String sortDir);

    // Tìm kiếm sản phẩm theo từ khóa (Search bar trên Navbar)
    Page<Product> searchProducts(String keyword, int page, int size, String sortBy, String sortDir);

    // Lấy sản phẩm nổi bật cho trang chủ (Hero Banner/Featured)
    List<Product> getFeaturedProducts();
}