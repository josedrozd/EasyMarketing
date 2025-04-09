package com.easymarketing.easymarketing.services.interfaces;

import com.easymarketing.easymarketing.model.domain.PurchaseProcessData;

import java.util.function.Function;

@FunctionalInterface
public interface IProcessPurchaseCart extends Function<Long, PurchaseProcessData> {
}
