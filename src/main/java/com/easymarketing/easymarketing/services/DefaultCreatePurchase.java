package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.exception.NotFoundException;
import com.easymarketing.easymarketing.exception.UnauthorizedException;
import com.easymarketing.easymarketing.model.domain.PreferenceRequestData;
import com.easymarketing.easymarketing.model.dto.PurchaseDTO;
import com.easymarketing.easymarketing.model.entity.Cart;
import com.easymarketing.easymarketing.model.entity.Purchase;
import com.easymarketing.easymarketing.model.entity.ServiceTier;
import com.easymarketing.easymarketing.model.enums.PurchaseStatusEnum;
import com.easymarketing.easymarketing.repository.jpa.PurchaseRepository;
import com.easymarketing.easymarketing.repository.jpa.ServiceRepository;
import com.easymarketing.easymarketing.repository.jpa.ServiceTierRepository;
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
    @Autowired
    private ServiceTierRepository serviceTierRepository;
    @Autowired
    private ServiceRepository serviceRepository;

    @Override
    public PreferenceRequestData apply(PurchaseDTO purchaseDTO) {
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
                .totalPrice(calculateTotalPrice(purchaseDTO))
                .status(PurchaseStatusEnum.CREATED)
                .date(now)
                .build();

        purchase.getCartItems()
                .addAll(buildCartItems(purchaseDTO, purchase, now));

        return purchase;
    }

    private List<Cart> buildCartItems(PurchaseDTO purchaseDTO, Purchase purchase, OffsetDateTime now) {
        return purchaseDTO.getCartItems()
                .stream()
                .flatMap(cartOrder -> cartOrder.stream()
                        .flatMap(cartItem -> cartItem.getUrls().stream()
                                .map(url -> Cart.builder()
                                    .purchase(purchase)
                                    .username(cartItem.getUsername())
                                    .platformId(cartItem.getPlatformId())
                                    .productId(cartItem.getProductId())
                                    .qualityId(cartItem.getQualityId())
                                    .quantityId(cartItem.getQuantityId())
                                    .url(url)
                                    .unitQuantity(cartItem.getUnitQuantity())
                                    .processed(Boolean.FALSE)
                                    .dateCreated(now)
                                    .lastUpdate(now)
                                    .build())))
                .toList();
    }

    private List<PreferenceItemRequest> buildItemsList(PurchaseDTO purchaseDTO) {
        return purchaseDTO.getCartItems().stream()
                .map(cartOrder -> {
                    com.easymarketing.easymarketing.model.entity.Service product = serviceRepository.findById(cartOrder.get(0).getProductId())
                            .orElseThrow(() -> new NotFoundException("Service product does not exist anymore."));
                    ServiceTier tier = serviceTierRepository.findById(cartOrder.get(0).getQuantityId())
                            .orElseThrow(() -> new NotFoundException("Quantity tier does not exist anymore."));
                    return PreferenceItemRequest.builder()
                            .id(cartOrder.get(0).getProductId().toString())
                            .title(product.getName())
                            .pictureUrl(PICTURE_URL)
                            .categoryId(product.getName())
                            .quantity(tier.getQuantity())
                            .currencyId("ARS")
                            .unitPrice(BigDecimal.valueOf(tier.getWithDiscount() ? tier.getFinalPrice() : tier.getBasePrice()))
                            .build();
                })
                .toList();
    }

    private Double calculateTotalPrice(PurchaseDTO purchaseDTO) {
        return  purchaseDTO.getCartItems().stream()
                .mapToDouble(order -> {
                    if (order.isEmpty() || !(order.stream().allMatch(e -> e.getQuantityId().equals(order.get(0).getQuantityId()))))
                        throw new UnauthorizedException("Someone is editing the order.");
                    ServiceTier tier = serviceTierRepository.findById(order.get(0).getQuantityId()).orElseThrow(() -> new NotFoundException("Quantity does not exist anymore."));
                    return tier.getWithDiscount() ? tier.getFinalPrice() : tier.getBasePrice();
                })
                .sum();
    }
}
