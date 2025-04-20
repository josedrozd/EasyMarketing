package com.easymarketing.easymarketing.utils;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.time.OffsetDateTime;
import java.util.Base64;

public class TransformImageUrlIntoBytes {

    public static String transform(String url){
        try (InputStream in = new URL(url).openStream()) {
            byte[] imageBytes = in.readAllBytes();
            return Base64.getEncoder().encodeToString(imageBytes);
        } catch (IOException e) {
            return null;
        }
    }

}
