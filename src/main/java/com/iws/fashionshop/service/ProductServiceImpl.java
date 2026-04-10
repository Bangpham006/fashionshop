package com.iws.fashionshop.service;

import com.iws.fashionshop.model.Product;
import com.iws.fashionshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Product createProduct(Product product) {
        // 1. Kiểm tra Slug trùng lặp
        if (productRepository.existsBySlug(product.getSlug())) {
            throw new RuntimeException("Đường dẫn (Slug) này đã tồn tại cho sản phẩm khác!");
        }
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(String id, Product productRequest) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm để cập nhật"));

        // 2. Logic kiểm tra slug khi update (Nếu đổi slug mới khác slug cũ thì mới check trùng)
        if (!existingProduct.getSlug().equals(productRequest.getSlug()) &&
                productRepository.existsBySlug(productRequest.getSlug())) {
            throw new RuntimeException("Slug mới đã bị trùng!");
        }

        existingProduct.setName(productRequest.getName());
        existingProduct.setSlug(productRequest.getSlug());
        existingProduct.setDescription(productRequest.getDescription());
        existingProduct.setBasePrice(productRequest.getBasePrice());
        existingProduct.setCategoryId(productRequest.getCategoryId());
        existingProduct.setBrand(productRequest.getBrand());
        existingProduct.setGender(productRequest.getGender());
        existingProduct.setImages(productRequest.getImages());
        existingProduct.setTags(productRequest.getTags());
        existingProduct.setFeatured(productRequest.isFeatured());
        existingProduct.setActive(productRequest.isActive());
        existingProduct.setUpdatedAt(LocalDateTime.now());

        return productRepository.save(existingProduct);
    }

    @Override
    public void deleteProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        // Nên dùng xóa mềm để không mất dữ liệu đơn hàng cũ
        product.setActive(false);
        productRepository.save(product);
    }

    @Override
    public Product getProductBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại!"));
    }

    @Override
    public Page<Product> getProductsByCategory(String categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return productRepository.findByCategoryIdAndIsActiveTrue(categoryId, pageable);
    }

    @Override
    public Page<Product> searchProducts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(keyword, pageable);
    }

    @Override
    public List<Product> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueAndIsActiveTrue();
    }

    @Override
    public Product getProductById(String id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("ID sai!"));
    }

    @Override
    public Page<Product> getAllProducts(int page, int size) {
        return productRepository.findAll(PageRequest.of(page, size));
    }
}