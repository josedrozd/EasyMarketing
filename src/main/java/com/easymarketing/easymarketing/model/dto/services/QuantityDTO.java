package com.easymarketing.easymarketing.model.dto.services;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class QuantityDTO extends NodeDTO {

    private Integer quantity;
    private Boolean withDiscount;
    private Double basePrice;
    private Double finalPrice;
    private Integer discount;

}
