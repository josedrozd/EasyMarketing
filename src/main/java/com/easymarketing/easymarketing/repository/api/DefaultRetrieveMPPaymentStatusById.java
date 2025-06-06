package com.easymarketing.easymarketing.repository.api;

import com.easymarketing.easymarketing.model.domain.MPAccessData;
import com.easymarketing.easymarketing.model.domain.MPPaymentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class DefaultRetrieveMPPaymentStatusById implements IRetrieveMPPaymentStatusById{

    @Autowired
    private IAccessTokenService accessTokenService;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public Boolean apply(Model model) {
        MPAccessData accessData = accessTokenService.get();
        String url = "https://api.mercadopago.com/v1/payments/" + model.getPaymentId();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessData.getAcccessToken());
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<MPPaymentResponse> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                MPPaymentResponse.class
        );

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            MPPaymentResponse body = response.getBody();
            return "approved".equalsIgnoreCase(body.getStatus())
                    && model.getToken().equals(body.getExternalReference());
        }

        return Boolean.FALSE;
    }

}
