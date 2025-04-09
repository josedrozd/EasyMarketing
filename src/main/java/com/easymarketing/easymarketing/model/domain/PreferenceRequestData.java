package com.easymarketing.easymarketing.model.domain;

import com.mercadopago.client.preference.PreferenceItemRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PreferenceRequestData {

    private String token;
    private List<PreferenceItemRequest> items;

}
