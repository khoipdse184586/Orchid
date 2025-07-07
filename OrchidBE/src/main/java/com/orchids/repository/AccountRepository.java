package com.orchids.repository;

import com.orchids.pojo.Account;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AccountRepository extends MongoRepository<Account, String> {
}
