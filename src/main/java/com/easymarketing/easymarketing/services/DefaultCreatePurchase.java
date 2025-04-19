package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.model.domain.PreferenceRequestData;
import com.easymarketing.easymarketing.model.dto.CartItemDTO;
import com.easymarketing.easymarketing.model.dto.PurchaseDTO;
import com.easymarketing.easymarketing.model.entity.Cart;
import com.easymarketing.easymarketing.model.entity.Purchase;
import com.easymarketing.easymarketing.model.enums.PurchaseStatusEnum;
import com.easymarketing.easymarketing.repository.jpa.PurchaseRepository;
import com.easymarketing.easymarketing.services.interfaces.ICreatePurchase;
import com.mercadopago.client.preference.PreferenceItemRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DefaultCreatePurchase implements ICreatePurchase {

    private final String PICTURE_URL = "https://imgur.com/a/07oQXeA";
    @Autowired
    private PurchaseRepository purchaseRepository;

    @Override
    public PreferenceRequestData apply(PurchaseDTO purchaseDTO) {
        purchaseDTO = PurchaseDTO.builder()
                .email("test@email.com")
                .totalPrice(150.00)
                .cartItems(List.of(
                        CartItemDTO.builder()
                                .serviceId(123)
                                .servicePrice(BigDecimal.valueOf(150.00))
                                .urls(List.of())
                                .build()
                ))
                .build();
        String token = UUID.randomUUID().toString();
        Purchase purchase = buildPurchaseEntity(purchaseDTO, token, OffsetDateTime.now());
        purchaseRepository.save(purchase);
        return PreferenceRequestData.builder()
                .token(token)
                .items(buildItemsList(purchaseDTO))
                .build();
    }

    private Purchase buildPurchaseEntity(PurchaseDTO purchaseDTO, String token, OffsetDateTime now) {
        Purchase purchase = Purchase.builder()
                .token(token)
                .mail(purchaseDTO.getEmail())
                .name(purchaseDTO.getName())
                .lastName(purchaseDTO.getLastName())
                .totalPrice(purchaseDTO.getTotalPrice())
                .status(PurchaseStatusEnum.CREATED)
                .date(now)
                .build();

        purchase.getCartItems()
                .addAll(purchaseDTO.getCartItems()
                        .stream()
                        .flatMap(cartItem -> cartItem.getUrls().stream()
                                .map(url -> Cart.builder()
                                        .purchase(purchase)
                                        .serviceId(cartItem.getServiceId())
                                        .url(url)
                                        .quantity(cartItem.getUnitQuantity())
                                        .urlType(cartItem.getUrlType())
                                        .provider(cartItem.getProvider())
                                        .processed(Boolean.FALSE)
                                        .build()))
                        .toList());

        return purchase;
    }

    private List<PreferenceItemRequest> buildItemsList(PurchaseDTO purchaseDTO) {
        return purchaseDTO.getCartItems().stream()
                .map(cartItem -> PreferenceItemRequest.builder()
                        .id(cartItem.getServiceId().toString())
                        .title(cartItem.getServiceName())
                        .pictureUrl(PICTURE_URL)
                        .categoryId("services")
                        .quantity(1)
                        .currencyId("ARS")
                        .unitPrice(cartItem.getServicePrice())
                        .build())
                .toList();
    }
}
