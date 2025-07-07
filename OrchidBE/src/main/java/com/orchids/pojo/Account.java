package com.orchids.pojo;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Document(collection = "accounts")
@Getter
@Setter
public class Account {
    @Id
    private String accountId;

    private String accountName;
    private String email;
    private String password;
    private Role role;

}