package com.easymarketing.easymarketing.services.interfaces;

import com.easymarketing.easymarketing.model.dto.PurchaseStatusDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;

import java.util.function.Function;

@FunctionalInterface
public interface IUpdatePurchaseStatus extends Function<IUpdatePurchaseStatus.Model, PurchaseStatusDTO> {

    @Getter
    @Builder
    class Model{

        @NonNull
        private Long paymentId;
        @NonNull
        private String token;

    }

}
