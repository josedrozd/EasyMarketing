package com.easymarketing.easymarketing.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class IGUserInfoDTO {

    private String id;
    @JsonProperty("profile_pic_url")
    private String profilePicUrl;
    @JsonProperty("is_private")
    private Boolean isPrivate;

}
