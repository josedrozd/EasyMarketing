package com.easymarketing.easymarketing.model.dto.services;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformDTO extends NodeDTO {

    private Boolean automaticPaymentAllowed;
    private Boolean active;

}
