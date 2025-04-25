package com.easymarketing.easymarketing.repository.api;

import com.easymarketing.easymarketing.model.dto.IGReelClipDTO;
import com.easymarketing.easymarketing.model.dto.IGUserClipsDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Component
public class DefaultRetrieveIGClipsByUserId implements IRetrieveIGClipsByUserId{

    @Value("${rocket.api.url}")
    private String API_URL;
    @Value("${rocket.api.key}")
    private String API_KEY;
    private final Integer count = 12;

    @Override
    public IGUserClipsDTO apply(IRetrieveIGClipsByUserId.Model model) {

        try {
            HttpClient client = HttpClient.newHttpClient();

            StringBuilder requestBodyBuilder = new StringBuilder();
            requestBodyBuilder.append("{")
                    .append("\"id\":").append(model.getUserId()).append(",")
                    .append("\"count\":").append(count);
            if (model.getNextMaxId() != null) {
                requestBodyBuilder.append(",\"max_id\":\"").append(model.getNextMaxId()).append("\"");
            }
            requestBodyBuilder.append("}");

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL + "/instagram/user/get_clips"))
                    .header("Content-Type", "application/json")
                    .header("x-rapidapi-host", "rocketapi-for-developers.p.rapidapi.com")
                    .header("x-rapidapi-key", API_KEY)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBodyBuilder.toString()))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body());

            JsonNode bodyNode = root.path("response").path("body");
            boolean moreAvailable = bodyNode.path("paging_info").path("more_available").asBoolean(false);
            String nextMaxId = bodyNode.path("paging_info").has("max_id") ? bodyNode.path("paging_info").path("max_id").asText(null) : null;

            List<IGReelClipDTO> reelClips = processreelClips(bodyNode);

            return IGUserClipsDTO.builder()
                    .moreAvailable(moreAvailable)
                    .nextMaxId(nextMaxId)
                    .reelClips(reelClips)
                    .build();

        } catch (Exception e) {
            return IGUserClipsDTO.builder().moreAvailable(false).reelClips(List.of()).build();
        }
    }

    public List<IGReelClipDTO> processreelClips(JsonNode bodyNode) throws InterruptedException, ExecutionException {
        List<IGReelClipDTO> reelClips = new ArrayList<>();
        JsonNode items = bodyNode.path("items");

        List<CompletableFuture<IGReelClipDTO>> futures = new ArrayList<>();

        for (JsonNode item : items) {
            CompletableFuture<IGReelClipDTO> future = CompletableFuture.supplyAsync(() -> {
                JsonNode candidates = item.path("media").path("image_versions2").path("candidates");
                if (candidates.isArray() && candidates.size() > 0) {
                    String picUrl = candidates.get(0).path("url").asText(null);
                    String url = item.path("media").path("code").asText(null);
                    if (isNotBlank(picUrl) && isNotBlank(url)) {
                        return IGReelClipDTO.builder()
                                .picUrl(picUrl)
                                .url(url)
                                .build();
                    }
                }
                return null;
            });

            futures.add(future);
        }

        List<IGReelClipDTO> result = CompletableFuture.allOf(
                        futures.toArray(new CompletableFuture[0])
                ).thenApply(v -> futures.stream()
                        .map(CompletableFuture::join)
                        .filter(resultItem -> resultItem != null)
                        .collect(Collectors.toList()))
                .get();

        return result;
    }

}
