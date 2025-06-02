package com.easymarketing.easymarketing.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PreferenceDTO {

    private String preferenceId;
    private String purchaseToken;
    private String accessToken;
    private String publicKey;

}
