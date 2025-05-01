package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.model.dto.CartItemUnitDTO;
import com.easymarketing.easymarketing.model.dto.PurchaseStatusDTO;
import com.easymarketing.easymarketing.model.entity.Cart;
import com.easymarketing.easymarketing.model.entity.Purchase;
import com.easymarketing.easymarketing.repository.jpa.CartRepository;
import com.easymarketing.easymarketing.repository.jpa.PurchaseRepository;
import com.easymarketing.easymarketing.services.interfaces.IRetrievePurchaseStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static com.easymarketing.easymarketing.model.enums.PurchaseStatusEnum.COMPLETED;
import static com.easymarketing.easymarketing.utils.PublicMethodsUtil.buildLink;

@Service
public class DefaultRetrievePurchaseStatus implements IRetrievePurchaseStatus {

    @Autowired
    private RedisService redisService;
    @Autowired
    private PurchaseRepository purchaseRepository;

    @Override
    public PurchaseStatusDTO apply(Long purchaseId) {
        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(()-> new RuntimeException(""));
        return PurchaseStatusDTO.builder()
                .id(purchaseId)
                .isApproved(Boolean.TRUE)
                .isCompleted(COMPLETED.equals(purchase.getStatus()))
                .isProcessing(redisService.isProcessing(purchaseId))
                .isStarted(redisService.isStarted(purchaseId))
                .items(buildItemsList(purchase.getCartItems()))
                .build();
    }

    private List<CartItemUnitDTO> buildItemsList(List<Cart> cartItems) {
        return cartItems.stream()
                .map(item -> CartItemUnitDTO.builder()
                        .username(item.getUsername())
                        .serviceId(item.getServiceId())
                        .serviceName("undefined")
                        .url(buildLink(item.getUrl(), item.getUrlType()))
                        .provider(item.getProvider().toString())
                        .quantity(item.getQuantity())
                        .processed(item.getProcessed())
                        .build())
                .toList();
    }

}
