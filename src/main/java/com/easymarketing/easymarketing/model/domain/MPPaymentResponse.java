package com.easymarketing.easymarketing.model.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MPPaymentResponse {

    private String status;
    @JsonProperty("external_reference")
    private String externalReference;

}
