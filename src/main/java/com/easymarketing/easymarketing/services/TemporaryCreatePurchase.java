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
        System.out.println(purchaseDTO.getEmail());
        System.out.println(purchaseDTO.getTotalPrice());
        System.out.println(purchaseDTO.getCartItems());
        String token = UUID.randomUUID().toString();
        Purchase purchase = buildPurchaseEntity(purchaseDTO, token, OffsetDateTime.now());
        purchaseRepository.save(purchase);
        return purchase.getId();
    }

    private Purchase buildPurchaseEntity(PurchaseDTO purchaseDTO, String token, OffsetDateTime now) {
        Purchase purchase = Purchase.builder()
                .token(token)
                .mail(purchaseDTO.getEmail())
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
                                        .processed(Boolean.FALSE)
                                        .build()))
                        .toList());

        return purchase;
    }

}
