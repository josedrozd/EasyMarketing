package com.easymarketing.easymarketing.model.dto;

import com.easymarketing.easymarketing.model.enums.ServiceProviderEnum;
import com.easymarketing.easymarketing.model.enums.UrlTypeEnum;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {

    private Integer serviceId;
    private String serviceName;
    private List<String> urls;
    private UrlTypeEnum urlType;
    private ServiceProviderEnum provider;
    private Integer unitQuantity;
    private BigDecimal servicePrice;

}
