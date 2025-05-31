package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.exception.NotFoundException;
import com.easymarketing.easymarketing.model.dto.CartItemUnitDTO;
import com.easymarketing.easymarketing.model.dto.PurchaseStatusDTO;
import com.easymarketing.easymarketing.model.entity.Cart;
import com.easymarketing.easymarketing.model.entity.Purchase;
import com.easymarketing.easymarketing.model.entity.ServiceQuality;
import com.easymarketing.easymarketing.repository.jpa.CartRepository;
import com.easymarketing.easymarketing.repository.jpa.PurchaseRepository;
import com.easymarketing.easymarketing.repository.jpa.ServiceQualityRepository;
import com.easymarketing.easymarketing.repository.jpa.ServiceRepository;
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
    @Autowired
    private ServiceQualityRepository serviceQualityRepository;
    @Autowired
    private ServiceRepository serviceRepository;

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
                .map(item -> {
                    ServiceQuality quality = serviceQualityRepository.findById(item.getQualityId())
                            .orElseThrow(() -> new NotFoundException("Quality does not exist anymore."));
                    com.easymarketing.easymarketing.model.entity.Service product = serviceRepository.findById(item.getProductId())
                            .orElseThrow(() -> new NotFoundException("Product does not exist anymore."));
                    return CartItemUnitDTO.builder()
                            .username(item.getUsername())
                            .serviceId(quality.getProviderServiceId())
                            .serviceName(product.getName())
                            .url(buildLink(item.getUrl(), product.getType()))
                            .provider(quality.getProvider().toString())
                            .quantity(item.getUnitQuantity())
                            .processed(item.getProcessed())
                            .build();
                })
                .toList();
    }

}
