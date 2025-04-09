package com.easymarketing.easymarketing.services.interfaces;

import com.easymarketing.easymarketing.model.domain.PreferenceRequestData;
import com.easymarketing.easymarketing.model.dto.PurchaseDTO;

import java.util.function.Function;

@FunctionalInterface
public interface ICreatePurchase extends Function<PurchaseDTO, PreferenceRequestData> {
}
