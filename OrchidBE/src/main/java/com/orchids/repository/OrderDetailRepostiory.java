package com.orchids.repository;

import com.orchids.pojo.OrderDetail;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OrderDetailRepostiory extends MongoRepository<OrderDetail, String> {
    // Additional query methods can be defined here if needed
}
