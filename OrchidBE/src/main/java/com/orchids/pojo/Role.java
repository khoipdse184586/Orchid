package com.orchids.pojo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import lombok.*;
import java.util.List;

@Getter
@Setter
@Document(collection = "roles")
public class Role {
    @Id
    private String roleId;
    private String roleName;

    @DBRef
    private List<Account> accounts;
}