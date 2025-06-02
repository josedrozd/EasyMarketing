package com.easymarketing.easymarketing.services.interfaces;

import com.easymarketing.easymarketing.model.dto.PreferenceDTO;
import com.easymarketing.easymarketing.model.dto.PurchaseDTO;
import com.mercadopago.resources.preference.Preference;

import java.util.function.Function;

@FunctionalInterface
public interface ICreateMPPreference extends Function<PurchaseDTO, PreferenceDTO> {
}
