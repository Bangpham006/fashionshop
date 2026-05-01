package com.iws.fashionshop.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.iws.fashionshop.model.Product;

public interface ProductService {

    Product createProduct(Product product);

    Product updateProduct(String id, Product product);

    void deleteProduct(String id);

    Product getProductById(String id);

    Product getProductBySlug(String slug);

    Page<Product> getFilteredProducts(String categoryId, String gender, int page, int size, String sortBy, String sortDir);

    Page<Product> searchProducts(String keyword, int page, int size, String sortBy, String sortDir);

    List<Product> getFeaturedProducts();
}
