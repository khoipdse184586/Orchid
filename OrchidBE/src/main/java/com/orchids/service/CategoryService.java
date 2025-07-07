package com.orchids.service;

import com.orchids.dto.CategoryRequest;
import com.orchids.dto.CategoryResponse;
import java.util.List;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest request);
    CategoryResponse updateCategory(String categoryId, CategoryRequest request);
    void deleteCategory(String categoryId);
    CategoryResponse getCategoryById(String categoryId);
    List<CategoryResponse> getAllCategories();
}