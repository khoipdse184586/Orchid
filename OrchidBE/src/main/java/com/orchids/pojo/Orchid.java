package com.orchids.pojo;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Document(collection = "orchids")
@Getter
@Setter
public class Orchid {
    @Id
    private String orchidId;

    private Boolean isNatural;

    private String orchidDescription;

    private String orchidName;

    private String orchidUrl;

    private BigDecimal price;

    private String status = "ACTIVE";

    private Category category;

    private List<OrderDetail> orderDetails;
}