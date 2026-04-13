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

    // --- PHẦN ADMIN QUẢN LÝ ---

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

        if (!existingProduct.getSlug().equals(productRequest.getSlug()) &&
                productRepository.existsBySlug(productRequest.getSlug())) {
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
        product.setActive(false); // Xóa mềm
        productRepository.save(product);
    }

    // --- PHẦN HIỂN THỊ CHO USER ---

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

        // 1. Thiết lập Sắp xếp động (Ví dụ: basePrice, asc/desc)
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        // 2. Logic lọc phân cấp (Ưu tiên từ chi tiết đến tổng quát)

        // Trường hợp lọc cả 2: Ví dụ: Men + Shoes
        if (categoryId != null && !categoryId.isEmpty() && gender != null && !gender.isEmpty()) {
            return productRepository.findByCategoryIdAndGenderAndIsActiveTrue(categoryId, gender, pageable);
        }

        // Trường hợp chỉ lọc Giới tính: Ví dụ: Click vào menu "Men"
        if (gender != null && !gender.isEmpty()) {
            return productRepository.findByGenderAndIsActiveTrue(gender, pageable);
        }

        // Trường hợp chỉ lọc Danh mục: Ví dụ: Click vào "Giày" (chung cho cả nam/nữ)
        if (categoryId != null && !categoryId.isEmpty()) {
            return productRepository.findByCategoryIdAndIsActiveTrue(categoryId, pageable);
        }

        // Mặc định: Trả về tất cả sản phẩm đang hoạt động
        return productRepository.findAll(pageable);
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
}