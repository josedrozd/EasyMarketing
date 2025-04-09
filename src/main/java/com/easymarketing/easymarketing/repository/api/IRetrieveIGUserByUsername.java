package com.easymarketing.easymarketing.repository.api;

import com.easymarketing.easymarketing.model.dto.IGUserInfoDTO;

import java.util.function.Function;

@FunctionalInterface
public interface IRetrieveIGUserByUsername extends Function<String, IGUserInfoDTO> {
}
