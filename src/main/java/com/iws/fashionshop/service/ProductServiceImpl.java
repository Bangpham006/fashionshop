package com.iws.fashionshop.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.iws.fashionshop.model.Product;
import com.iws.fashionshop.repository.ProductRepository;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Product createProduct(Product product) {
        if (productRepository.existsBySlug(product.getSlug())) {
            throw new RuntimeException("Đường dẫn (Slug) này đã tồn tại!");
        }
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(String id, Product productRequest) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        if (!existingProduct.getSlug().equals(productRequest.getSlug())
                && productRepository.existsBySlug(productRequest.getSlug())) {
            throw new RuntimeException("Slug mới bị trùng!");
        }

        existingProduct.setName(productRequest.getName());
        existingProduct.setSlug(productRequest.getSlug());
        existingProduct.setDescription(productRequest.getDescription());
        existingProduct.setBasePrice(productRequest.getBasePrice());
        existingProduct.setCategoryId(productRequest.getCategoryId());
        existingProduct.setBrand(productRequest.getBrand());
        existingProduct.setGender(productRequest.getGender());
        existingProduct.setImages(productRequest.getImages());
        existingProduct.setFeatured(productRequest.isFeatured());
        existingProduct.setActive(productRequest.isActive());
        existingProduct.setUpdatedAt(LocalDateTime.now());

        return productRepository.save(existingProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Sản phẩm không tồn tại");
        }
        productRepository.deleteById(id);
    }

    @Override
    public Product getProductById(String id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("ID sai!"));
    }

    @Override
    public Product getProductBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại!"));
    }

    @Override
    public Page<Product> getFilteredProducts(String categoryId, String gender, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        if (categoryId != null && !categoryId.isEmpty() && gender != null && !gender.isEmpty()) {
            return productRepository.findByCategoryIdAndGenderAndIsActiveTrue(categoryId, gender, pageable);
        }

        if (gender != null && !gender.isEmpty()) {
            return productRepository.findByGenderAndIsActiveTrue(gender, pageable);
        }

        if (categoryId != null && !categoryId.isEmpty()) {
            return productRepository.findByCategoryIdAndIsActiveTrue(categoryId, pageable);
        }
        return productRepository.findAll(pageable);
    }

    @Override
    public Page<Product> searchProducts(String keyword, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(keyword, pageable);
    }

    @Override
    public List<Product> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueAndIsActiveTrue();
    }
}
