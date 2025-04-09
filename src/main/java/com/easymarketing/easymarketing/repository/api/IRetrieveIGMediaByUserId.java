package com.easymarketing.easymarketing.repository.api;

import com.easymarketing.easymarketing.model.dto.IGUserMediaDTO;
import lombok.Builder;
import lombok.Getter;

import java.util.function.Function;

@FunctionalInterface
public interface IRetrieveIGMediaByUserId extends Function<IRetrieveIGMediaByUserId.Model, IGUserMediaDTO> {

    @Getter
    @Builder
    class Model {
        private Long userId;
        private String nextMaxId;
    }

}
