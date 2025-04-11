package com.easymarketing.easymarketing.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseStatusDTO {

    private Long id;
    private Boolean isApproved;
    private Boolean isCompleted;

}
