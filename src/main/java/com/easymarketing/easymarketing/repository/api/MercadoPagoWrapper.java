package com.easymarketing.easymarketing.repository.api;

import com.easymarketing.easymarketing.model.domain.MPAccessData;
import com.easymarketing.easymarketing.model.domain.PreferenceResponseData;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class MercadoPagoWrapper implements IMercadoPagoWrapper {

    @Autowired
    private IAccessTokenService accessTokenService;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public PreferenceResponseData apply(Map<String, Object> preferenceData) {
        MPAccessData accessData = accessTokenService.get();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessData.getAcccessToken());

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(preferenceData, headers);

        String url = "https://api.mercadopago.com/checkout/preferences";

        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            try {
                return PreferenceResponseData.builder()
                        .preference(objectMapper.readValue(response.getBody(), Preference.class))
                        .accessToken(accessData.getAcccessToken())
                        .publicKey(accessData.getPublicKey())
                        .build();
            } catch (Exception e) {
                throw new RuntimeException("Error al parsear la respuesta de Mercado Pago", e);
            }
        } else {
            throw new RuntimeException("Error al crear preferencia: " + response.getStatusCode());
        }
    }
}
