package com.orchids.repository;

import com.orchids.pojo.Orchid;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OrchidRepository extends MongoRepository<Orchid, String> {
}
