package com.orchids.pojo;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.annotation.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Document(collection = "order_details")
@Getter
@Setter
public class OrderDetail {
    @Id
    private String orderDetailId;
    private String orderId;  // Store only the ID instead of the full Order object
    @DBRef
    private Orchid orchid;
    private BigDecimal price;
    private Integer quantity;
}