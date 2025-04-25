package com.easymarketing.easymarketing.repository.api;

import com.easymarketing.easymarketing.model.dto.IGUserClipsDTO;
import lombok.Builder;
import lombok.Getter;

import java.util.function.Function;

@FunctionalInterface
public interface IRetrieveIGClipsByUserId extends Function<IRetrieveIGClipsByUserId.Model, IGUserClipsDTO> {

    @Getter
    @Builder
    class Model {
        private Long userId;
        private String nextMaxId;
    }

}
