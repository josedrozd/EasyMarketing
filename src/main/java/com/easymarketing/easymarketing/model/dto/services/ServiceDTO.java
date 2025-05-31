package com.easymarketing.easymarketing.model.dto.services;

import com.easymarketing.easymarketing.model.entity.ServicePlatform;
import com.easymarketing.easymarketing.model.enums.UrlTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDTO extends NodeDTO {

    private String product;
    private UrlTypeEnum type;
    private String imgUrl;
    private Boolean activated;
    private String description;

}
