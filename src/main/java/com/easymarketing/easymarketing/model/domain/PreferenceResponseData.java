package com.easymarketing.easymarketing.model.domain;

import com.mercadopago.resources.preference.Preference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PreferenceResponseData {

    private Preference preference;
    private String accessToken;
    private String publicKey;
}
