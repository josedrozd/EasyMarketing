package com.easymarketing.easymarketing.model.dto;

import lombok.*;

import java.util.List;

@Getter
@Builder
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {

    private String username;
    private Integer platformId;
    private Integer productId;
    private Integer qualityId;
    private Integer quantityId;
    private List<String> urls;
    private Integer unitQuantity;

}
