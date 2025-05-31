package com.easymarketing.easymarketing.utils;

import com.easymarketing.easymarketing.model.enums.UrlTypeEnum;

public class PublicMethodsUtil {

    public static String buildLink(String url, UrlTypeEnum type){
        if (type == UrlTypeEnum.POST){
            return String.format("https://www.instagram.com/p/%s/", url);
        } else if (type == UrlTypeEnum.PROFILE){
            return String.format("https://www.instagram.com/%s/", url);
        } else if (type == UrlTypeEnum.REEL){
            return String.format("https://www.instagram.com/reel/%s/", url);
        } else if (type == UrlTypeEnum.OTHER){
            return url;
        } else {
            throw new RuntimeException("Invalid urlType");
        }
    }

}
