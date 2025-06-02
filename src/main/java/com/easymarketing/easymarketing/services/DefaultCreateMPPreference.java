package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.model.domain.PreferenceRequestData;
import com.easymarketing.easymarketing.model.domain.PreferenceResponseData;
import com.easymarketing.easymarketing.model.dto.PreferenceDTO;
import com.easymarketing.easymarketing.model.dto.PurchaseDTO;
import com.easymarketing.easymarketing.repository.api.IMercadoPagoWrapper;
import com.easymarketing.easymarketing.services.interfaces.ICreateMPPreference;
import com.easymarketing.easymarketing.services.interfaces.ICreatePurchase;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DefaultCreateMPPreference implements ICreateMPPreference {

    @Value("${mp.backurl.success}")
    private String SUCCESS_URL;
    @Value("${mp.backurl.failure}")
    private String FAILURE_URL;
    @Value("${mp.backurl.pending}")
    private String PENDING_URL;

    @Autowired
    private ICreatePurchase createPurchase;
    @Autowired
    private IMercadoPagoWrapper mercadoPagoWrapper;

    @Override
    public PreferenceDTO apply(PurchaseDTO purchase) {
        try {
            PreferenceRequestData preferenceRequestData = createPurchase.apply(purchase);

            Map<String, Object> preferenceData = Map.of(
                    "items", mapItems(preferenceRequestData.getItems()),
                    "back_urls", Map.of(
                            "success", SUCCESS_URL,
                            "failure", FAILURE_URL,
                            "pending", PENDING_URL
                    ),
                    "auto_return", "approved",
                    "statement_descriptor", "EASYMARKETING",
                    "external_reference", preferenceRequestData.getToken(),
                    "expires", true,
                    "expiration_date_from", OffsetDateTime.now().minusDays(2).toString(),
                    "expiration_date_to", OffsetDateTime.now().plusHours(5).toString()
            );

            PreferenceResponseData preferenceResponseData = mercadoPagoWrapper.apply(preferenceData);
            return PreferenceDTO.builder()
                    .preferenceId(preferenceResponseData.getPreference().getId())
                    .purchaseToken(preferenceRequestData.getToken())
                    .accessToken(preferenceResponseData.getAccessToken())
                    .publicKey(preferenceResponseData.getPublicKey())
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Error al crear preferencia de MP: " + e.getMessage(), e);
        }
    }

    private List<Map<String, Object>> mapItems(List<PreferenceItemRequest> items) {
        return items.stream().map(item ->
                Map.<String, Object>of(
                        "title", (Object) item.getTitle(),
                        "quantity", (Object) item.getQuantity(),
                        "unit_price", (Object) item.getUnitPrice(),
                        "currency_id", (Object) item.getCurrencyId()
                )
        ).collect(Collectors.toList());
    }

}
