package com.easymarketing.easymarketing.model.dto;

import com.easymarketing.easymarketing.model.entity.Cart;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseStatusDTO {

    private Long id;
    private Boolean isApproved;
    private Boolean isCompleted;
    private Boolean isProcessing;
    private Boolean isStarted;
    private Boolean isCanceled;
    @Builder.Default
    private List<CartItemUnitDTO> items = new ArrayList<>();

}
