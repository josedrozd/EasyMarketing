package com.easymarketing.easymarketing.model.dto.services;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class QualityDTO extends NodeDTO {

    private String provider;
    private Integer providerServiceId;
    private Integer minimum;
    private Integer priority;
    private Boolean automaticPayment;
    private Boolean activated;

}
