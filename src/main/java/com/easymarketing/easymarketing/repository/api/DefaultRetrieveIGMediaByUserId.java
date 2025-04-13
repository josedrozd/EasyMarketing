package com.easymarketing.easymarketing.repository.api;

import com.easymarketing.easymarketing.model.dto.IGMediaPostDTO;
import com.easymarketing.easymarketing.model.dto.IGUserMediaDTO;
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

import static com.easymarketing.easymarketing.utils.TransformImageUrlIntoBytes.transform;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Component
public class DefaultRetrieveIGMediaByUserId implements IRetrieveIGMediaByUserId{

    @Value("${rocket.api.url}")
    private String API_URL;
    @Value("${rocket.api.key}")
    private String API_KEY;
    private final Integer count = 12;

    @Override
    public IGUserMediaDTO apply(Model model) {

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
                    .uri(URI.create(API_URL + "/instagram/user/get_media"))
                    .header("Content-Type", "application/json")
                    .header("x-rapidapi-host", "rocketapi-for-developers.p.rapidapi.com")
                    .header("x-rapidapi-key", API_KEY)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBodyBuilder.toString()))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body());

            JsonNode bodyNode = root.path("response").path("body");
            boolean moreAvailable = bodyNode.path("more_available").asBoolean(false);
            String nextMaxId = bodyNode.has("next_max_id") ? bodyNode.path("next_max_id").asText(null) : null;

            List<IGMediaPostDTO> mediaPosts = processMediaPosts(bodyNode);

            return IGUserMediaDTO.builder()
                    .moreAvailable(moreAvailable)
                    .nextMaxId(nextMaxId)
                    .mediaPosts(mediaPosts)
                    .build();

        } catch (Exception e) {
            return IGUserMediaDTO.builder().moreAvailable(false).mediaPosts(List.of()).build();
        }
    }

    public List<IGMediaPostDTO> processMediaPosts(JsonNode bodyNode) throws InterruptedException, ExecutionException {
        List<IGMediaPostDTO> mediaPosts = new ArrayList<>();
        JsonNode items = bodyNode.path("items");

        List<CompletableFuture<IGMediaPostDTO>> futures = new ArrayList<>();

        for (JsonNode item : items) {
            CompletableFuture<IGMediaPostDTO> future = CompletableFuture.supplyAsync(() -> {
                JsonNode candidates = item.path("image_versions2").path("candidates");
                if (candidates.isArray() && candidates.size() > 0) {
                    String picUrl = transform(candidates.get(0).path("url").asText(null));
                    String url = item.path("code").asText(null);
                    if (isNotBlank(picUrl) && isNotBlank(url)) {
                        return IGMediaPostDTO.builder()
                                .picUrl(picUrl)
                                .url(url)
                                .build();
                    }
                }
                return null;
            });

            futures.add(future);
        }

        List<IGMediaPostDTO> result = CompletableFuture.allOf(
                        futures.toArray(new CompletableFuture[0])
                ).thenApply(v -> futures.stream()
                        .map(CompletableFuture::join) //
                        .filter(resultItem -> resultItem != null)
                        .collect(Collectors.toList()))
                .get();

        return result;
    }

    private boolean isNotBlank(String str) {
        return str != null && !str.trim().isEmpty();
    }

}
