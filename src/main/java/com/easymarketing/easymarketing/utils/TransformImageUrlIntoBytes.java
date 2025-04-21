package com.easymarketing.easymarketing.utils;

public class TransformImageUrlIntoBytes {

    private static final String PROXY_URL = "https://vps-4877609-x.dattaweb.com/ig?url=";

    public static String transform(String url){
        return PROXY_URL + url;
    }

}
