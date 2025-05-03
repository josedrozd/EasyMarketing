package com.easymarketing.easymarketing.repository.api;

import lombok.Builder;
import lombok.Getter;

import java.util.function.Consumer;

@FunctionalInterface
public interface ISESEmailService extends Consumer<ISESEmailService.Model> {

    @Getter
    @Builder
    class Model {
        private String to;
        private String subject;
        private String body;
    }

}
