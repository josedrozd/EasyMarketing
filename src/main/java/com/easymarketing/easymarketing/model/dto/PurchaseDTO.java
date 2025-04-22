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
    private String name;
    private String lastName;
    private Double totalPrice;
    private List<CartItemDTO> cartItems;

}
