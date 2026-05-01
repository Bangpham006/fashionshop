package com.iws.fashionshop.repository;

import com.iws.fashionshop.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {

    Optional<Category> findBySlug(String slug);

    List<Category> findByParentId(String parentId);

    List<Category> findByLevel(Integer level);

    boolean existsBySlug(String slug);
}
