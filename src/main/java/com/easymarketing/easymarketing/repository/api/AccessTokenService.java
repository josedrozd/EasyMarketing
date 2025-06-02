package com.easymarketing.easymarketing.repository.api;

import com.easymarketing.easymarketing.model.domain.MPAccessData;
import com.easymarketing.easymarketing.repository.api.IAccessTokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AccessTokenService implements IAccessTokenService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MPAccessData get() {
        String url = "https://blue-cloud-ed60.drozd-jose.workers.dev/";

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                return MPAccessData.builder()
                        .acccessToken(jsonNode.get("accessToken").asText())
                        .publicKey(jsonNode.get("publicKey").asText())
                        .build();
            } else {
                throw new RuntimeException("No se pudo obtener el token desde el endpoint");
            }

        } catch (Exception e) {
            throw new RuntimeException("Error al llamar al endpoint de accessToken", e);
        }
    }
}
