package com.easymarketing.easymarketing.model.dto.services;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ExtraDTO extends NodeDTO{

    private String imgUrl;
    private String destinationUrl;

}
