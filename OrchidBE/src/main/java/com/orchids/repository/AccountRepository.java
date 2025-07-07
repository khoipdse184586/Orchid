package com.orchids.repository;

import com.orchids.pojo.Account;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends MongoRepository<Account, String> {
     Account findByAccountName(String username);
}