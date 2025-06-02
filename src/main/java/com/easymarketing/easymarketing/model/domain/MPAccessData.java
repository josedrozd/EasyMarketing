package com.easymarketing.easymarketing.model.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MPAccessData {

    private String acccessToken;
    private String publicKey;
}
