package com.easymarketing.easymarketing.repository.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class SMMCostClient implements ISMMCostClient{

    @Autowired
    private RestTemplate restTemplate;

    @Value("${smmcost.api.key}")
    private String API_KEY;

    @Value("${smmcost.api.url}")
    private String API_URL;


    public Boolean apply(Model model) {
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
    }

}