package com.easymarketing.easymarketing.model.dto;

import lombok.*;

import java.util.List;

@Getter
@Builder
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseDTO {

    private String email;
    private Double totalPrice;
    private List<CartItemDTO> cartItems;

}
