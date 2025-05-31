package com.easymarketing.easymarketing.model.dto.services;

import com.easymarketing.easymarketing.model.enums.ServiceProviderEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class QualityDTO extends NodeDTO {

    private ServiceProviderEnum provider;
    private Integer providerServiceId;
    private Integer minimum;
    private Integer priority;
    private Boolean automaticPayment;
    private Boolean activated;
    private String description;

}
