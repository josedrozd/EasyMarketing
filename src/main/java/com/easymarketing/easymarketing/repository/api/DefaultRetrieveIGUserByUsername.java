package com.easymarketing.easymarketing.repository.api;

import com.easymarketing.easymarketing.exception.NotFoundException;
import com.easymarketing.easymarketing.model.dto.IGUserInfoDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Component
public class DefaultRetrieveIGUserByUsername implements IRetrieveIGUserByUsername{

    @Value("${rocket.api.url}")
    private String API_URL;
    @Value("${rocket.api.key}")
    private String API_KEY;

    @Override
    public IGUserInfoDTO apply(String username) {
        try {
            HttpClient client = HttpClient.newHttpClient();

            String requestBody = String.format("{\"username\":\"%s\"}", username);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL + "/instagram/user/get_info"))
                    .header("Content-Type", "application/json")
                    .header("x-rapidapi-host", "rocketapi-for-developers.p.rapidapi.com")
                    .header("x-rapidapi-key", API_KEY)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body());

            int internalStatus = root
                    .path("response")
                    .path("status_code")
                    .asInt();

            if (internalStatus != 200) {
                throw new NotFoundException(String.format("User not found with username: %s", username));
            }

            JsonNode userNode = root
                    .path("response")
                    .path("body")
                    .path("data")
                    .path("user");

            IGUserInfoDTO igUserInfoDTO = mapper.treeToValue(userNode, IGUserInfoDTO.class);
            igUserInfoDTO.convertImage();
            return igUserInfoDTO;
        } catch (Exception e) {
            return new IGUserInfoDTO();
        }
    }

}
