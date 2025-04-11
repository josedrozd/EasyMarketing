package com.easymarketing.easymarketing.repository.api;

import com.easymarketing.easymarketing.model.domain.MPPaymentResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;

import java.util.function.Function;

@FunctionalInterface
public interface IRetrieveMPPaymentStatusById extends Function<IRetrieveMPPaymentStatusById.Model, Boolean> {

    @Getter
    @Builder
    class Model{
        @NonNull
        private Long paymentId;
        @NonNull
        private String token;
    }

}
