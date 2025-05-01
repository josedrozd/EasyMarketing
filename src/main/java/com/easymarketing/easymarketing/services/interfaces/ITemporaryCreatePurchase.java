package com.easymarketing.easymarketing.services.interfaces;

import com.easymarketing.easymarketing.model.dto.PurchaseDTO;

import java.util.function.Function;

@FunctionalInterface
public interface ITemporaryCreatePurchase extends Function<PurchaseDTO, String> {
}
