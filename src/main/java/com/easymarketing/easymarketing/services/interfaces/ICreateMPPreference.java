package com.easymarketing.easymarketing.services.interfaces;

import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.resources.preference.Preference;

import java.util.List;
import java.util.function.Function;

@FunctionalInterface
public interface ICreateMPPreference extends Function<List<PreferenceItemRequest>, Preference> {
}
