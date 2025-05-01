package com.easymarketing.easymarketing.model.dto;

import lombok.*;

@Getter
@Builder
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class CartItemUnitDTO {

    private String username;
    private Integer serviceId;
    private String serviceName;
    private String url;
    private String provider;
    private Integer quantity;
    private Boolean processed;

}
