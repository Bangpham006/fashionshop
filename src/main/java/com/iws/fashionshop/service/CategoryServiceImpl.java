package com.iws.fashionshop.service;

import com.iws.fashionshop.model.Category;
import com.iws.fashionshop.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục này!"));
    }

    @Override
    public List<Category> getSubCategories(String parentId) {
        return categoryRepository.findByParentId(parentId);
    }

    @Override
    public Category createCategory(Category category) {
        if (categoryRepository.existsBySlug(category.getSlug())) {
            throw new RuntimeException("Đường dẫn (Slug) này đã tồn tại!");
        }
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(String id, Category category) {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại để cập nhật"));

        existingCategory.setName(category.getName());
        existingCategory.setSlug(category.getSlug());
        existingCategory.setParentId(category.getParentId());
        existingCategory.setLevel(category.getLevel());
        existingCategory.setActive(category.getActive());
        return categoryRepository.save(existingCategory);
    }

    @Override
    public void deleteCategory(String id) {
        if (!categoryRepository.findByParentId(id).isEmpty()) {
            throw new RuntimeException("Không thể xóa danh mục này vì vẫn còn danh mục con!");
        }
        categoryRepository.deleteById(id);
    }
}
