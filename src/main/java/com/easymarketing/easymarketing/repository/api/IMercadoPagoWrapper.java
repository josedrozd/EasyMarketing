package com.easymarketing.easymarketing.repository.api;

import com.easymarketing.easymarketing.model.domain.PreferenceResponseData;
import com.mercadopago.resources.preference.Preference;

import java.util.Map;
import java.util.function.Function;

public interface IMercadoPagoWrapper extends Function<Map<String, Object>, PreferenceResponseData> {
}
