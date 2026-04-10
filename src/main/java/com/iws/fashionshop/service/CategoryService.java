package com.iws.fashionshop.service;

import com.iws.fashionshop.model.Category;
import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    Category getCategoryBySlug(String slug);
    List<Category> getSubCategories(String parentId);
    Category createCategory(Category category);
    Category updateCategory(String id, Category category);
    void deleteCategory(String id);
}