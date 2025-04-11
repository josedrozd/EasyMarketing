package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.model.domain.PreferenceRequestData;
import com.easymarketing.easymarketing.model.dto.PurchaseDTO;
import com.easymarketing.easymarketing.services.interfaces.ICreateMPPreference;
import com.easymarketing.easymarketing.services.interfaces.ICreatePurchase;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

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

    @Override
    public Preference apply(PurchaseDTO purchase) {
        try {
            PreferenceRequestData preferenceRequestData = createPurchase.apply(purchase);

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(preferenceRequestData.getItems())
                    .backUrls(PreferenceBackUrlsRequest.builder()
                            .success(SUCCESS_URL)
                            .failure(FAILURE_URL)
                            .pending(PENDING_URL)
                            .build())
                    .autoReturn("approved")
                    .statementDescriptor("EASYMARKETING")
                    .externalReference(preferenceRequestData.getToken())
                    .expires(true)
                    .expirationDateFrom(OffsetDateTime.now().minusDays(2))
                    .expirationDateTo(OffsetDateTime.now().plusHours(1))
                    .build();
            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            return preference;

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
