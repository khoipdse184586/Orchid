package com.orchids.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountResponse {
    private String accountId;
    private String accountName;
    private String email;
    private String roleId;
}