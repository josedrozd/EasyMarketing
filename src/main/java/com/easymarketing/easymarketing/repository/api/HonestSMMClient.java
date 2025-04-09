package com.easymarketing.easymarketing.repository.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class HonestSMMClient {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${honestsmm.api.key}")
    private String API_KEY;

    @Value("${honestsmm.api.url}")
    private String API_URL;


    public Boolean createOrder(IHonestSMMClient.Model model) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String body = String.format("key=%s&action=add&service=%s&link=%s&quantity=%d",
                API_KEY, model.getServiceId(), model.getLink(), model.getQuantity());

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(API_URL, HttpMethod.POST, request, String.class);

        return response.getStatusCode().is2xxSuccessful();
    }

}