package com.easymarketing.easymarketing.services.interfaces;

import com.easymarketing.easymarketing.model.dto.PurchaseStatusDTO;

import java.util.function.Function;

@FunctionalInterface
public interface IRetrievePurchaseStatus extends Function<Long, PurchaseStatusDTO> {
}
