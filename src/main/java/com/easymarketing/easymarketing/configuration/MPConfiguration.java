package com.easymarketing.easymarketing.configuration;

import com.mercadopago.MercadoPagoConfig;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MPConfiguration {

    @PostConstruct
    public void configureMercadoPago() {
        MercadoPagoConfig.setAccessToken("APP_USR-6265697926969168-040417-56157408ee4a431c58093d8593f332f8-2373327872");
    }

}
