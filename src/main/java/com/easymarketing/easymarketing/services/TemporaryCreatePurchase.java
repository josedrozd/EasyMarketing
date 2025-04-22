package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.model.dto.PurchaseDTO;
import com.easymarketing.easymarketing.model.entity.Cart;
import com.easymarketing.easymarketing.model.entity.Purchase;
import com.easymarketing.easymarketing.model.enums.PurchaseStatusEnum;
import com.easymarketing.easymarketing.repository.jpa.PurchaseRepository;
import com.easymarketing.easymarketing.services.interfaces.ITemporaryCreatePurchase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
public class TemporaryCreatePurchase implements ITemporaryCreatePurchase {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Override
    public Long apply(PurchaseDTO purchaseDTO) {
        Purchase purchase = buildPurchaseEntity(purchaseDTO, UUID.randomUUID().toString(), OffsetDateTime.now());
        purchaseRepository.save(purchase);
        return purchase.getId();
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
                                        .username(cartItem.getUsername())
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

}
