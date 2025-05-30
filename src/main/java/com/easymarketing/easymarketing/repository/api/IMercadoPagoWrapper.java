package com.easymarketing.easymarketing.repository.api;

import com.mercadopago.resources.preference.Preference;

import java.util.Map;
import java.util.function.Function;

public interface IMercadoPagoWrapper extends Function<Map<String, Object>, Preference> {
}
