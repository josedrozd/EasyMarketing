package com.easymarketing.easymarketing.repository.api;

import lombok.Builder;
import lombok.Getter;

import java.util.function.Function;

@FunctionalInterface
public interface IHonestSMMClient extends Function<IHonestSMMClient.Model, Boolean> {

    @Getter
    @Builder
    class Model{
        private Integer serviceId;
        private String link;
        private Integer quantity;
    }

}
