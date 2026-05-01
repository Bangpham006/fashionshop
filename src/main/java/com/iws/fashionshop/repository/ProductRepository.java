package com.iws.fashionshop.repository;

import com.iws.fashionshop.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    Optional<Product> findBySlug(String slug);

    Page<Product> findByCategoryIdAndIsActiveTrue(String categoryId, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String name, Pageable pageable);

    Page<Product> findByGenderAndIsActiveTrue(String gender, Pageable pageable);

    List<Product> findByIsFeaturedTrueAndIsActiveTrue();

    Page<Product> findByBrandAndIsActiveTrue(String brand, Pageable pageable);

    Page<Product> findByBrandAndGenderAndIsActiveTrue(String brand, String gender, Pageable pageable);

    boolean existsBySlug(String slug);

    Page<Product> findByCategoryIdAndGenderAndIsActiveTrue(String categoryId, String gender, Pageable pageable);

}
