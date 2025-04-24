package com.easymarketing.easymarketing.repository.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import static com.easymarketing.easymarketing.model.enums.ServiceProviderEnum.HONEST;
import static com.easymarketing.easymarketing.model.enums.ServiceProviderEnum.SMMCOST;

@Slf4j
@Component
public class SMMCostClient implements ISMMCostClient{

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private RetryTemplate retryTemplate;

    @Value("${smmcost.api.key}")
    private String API_KEY;

    @Value("${smmcost.api.url}")
    private String API_URL;


    public Boolean apply(Model model) {
        try {
            return retryTemplate.execute(context -> {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

                String body = String.format("key=%s&action=add&service=%s&link=%s&quantity=%d&username=%s",
                        API_KEY, model.getServiceId(), model.getLink(), model.getQuantity(), model.getUsername());

                HttpEntity<String> request = new HttpEntity<>(body, headers);

                ResponseEntity<String> response = restTemplate.exchange(API_URL, HttpMethod.POST, request, String.class);

                if (response.getBody().contains("\"error\":\"Not enough funds on balance\"")
                        || response.getBody().contains("\"error\":\"Incorrect service ID\"")
                        || response.getBody().contains("error\":\"Quantity more than maximum 10000\""))
                    return false;

                return response.getStatusCode().is2xxSuccessful();
            });
        } catch (Exception e) {
            log.error(String.format("❌ ERROR procesando servicio: %s, link: %s, cantidad: %s y proveedor: %s. Exception error: %s Exception class: %s.",
                    model.getServiceId(), model.getLink(), model.getQuantity(), HONEST, e.getMessage(), e.getClass()));
            return false;
        }
    }

}