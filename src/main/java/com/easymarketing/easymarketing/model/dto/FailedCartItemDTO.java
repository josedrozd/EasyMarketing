package com.easymarketing.easymarketing.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FailedCartItemDTO {

    private Integer serviceId;
    private String url;
    private Integer quantity;

}
