package com.orchids.pojo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "orders")
@Getter
@Setter
public class Order {
    @Id
    private String id;

    @DBRef
    private Account account;
    private LocalDateTime orderDate;
    private String orderStatus;
    private BigDecimal totalAmount;

    @DBRef
    private List<OrderDetail> orderDetails;
}