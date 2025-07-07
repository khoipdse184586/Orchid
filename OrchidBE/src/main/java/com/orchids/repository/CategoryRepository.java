package com.orchids.repository;

import com.orchids.pojo.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository<Category, String> {
    // Additional query methods can be defined here if needed
}
