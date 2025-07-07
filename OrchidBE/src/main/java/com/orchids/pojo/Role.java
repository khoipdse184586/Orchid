package com.orchids.pojo;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import lombok.*;

import java.util.List;


@Document(collection = "roles")
@Getter
@Setter
public class Role {
    @Id
    private String roleId;

    private String roleName;

    private List<Account> accounts;
}