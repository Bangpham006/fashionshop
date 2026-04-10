package com.iws.fashionshop.service;

import com.iws.fashionshop.model.Product;
import org.springframework.data.domain.Page;
import java.util.List;

public interface ProductService {
    // Quản lý (Admin)
    Product createProduct(Product product);
    Product updateProduct(String id, Product product);
    void deleteProduct(String id); // Xóa mềm (set isActive = false)

    // Hiển thị (User)
    Product getProductById(String id);
    Product getProductBySlug(String slug);
    Page<Product> getAllProducts(int page, int size);
    Page<Product> getProductsByCategory(String categoryId, int page, int size);
    Page<Product> searchProducts(String keyword, int page, int size);
    List<Product> getFeaturedProducts();
}