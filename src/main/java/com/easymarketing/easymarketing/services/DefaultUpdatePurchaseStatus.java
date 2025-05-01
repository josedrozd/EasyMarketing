package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.exception.NotFoundException;
import com.easymarketing.easymarketing.model.dto.CartItemUnitDTO;
import com.easymarketing.easymarketing.model.dto.FailedCartItemDTO;
import com.easymarketing.easymarketing.model.dto.PurchaseStatusDTO;
import com.easymarketing.easymarketing.model.entity.Cart;
import com.easymarketing.easymarketing.model.entity.Purchase;
import com.easymarketing.easymarketing.repository.api.IRetrieveMPPaymentStatusById;
import com.easymarketing.easymarketing.repository.jpa.PurchaseRepository;
import com.easymarketing.easymarketing.services.interfaces.IUpdatePurchaseStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static com.easymarketing.easymarketing.model.enums.PurchaseStatusEnum.COMPLETED;
import static com.easymarketing.easymarketing.utils.PublicMethodsUtil.buildLink;

@Service
public class DefaultUpdatePurchaseStatus implements IUpdatePurchaseStatus {

    @Autowired
    private RedisService redisService;
    @Autowired
    private IRetrieveMPPaymentStatusById retrieveMPPaymentStatusById;
    @Autowired
    private PurchaseRepository purchaseRepository;

    @Override
    public PurchaseStatusDTO apply(Model model) {
        Boolean isApproved = retrieveMPPaymentStatusById.apply(IRetrieveMPPaymentStatusById.Model.builder()
                .token(model.getToken())
                .paymentId(model.getPaymentId())
                .build());

        if(!isApproved) return PurchaseStatusDTO.builder()
                .id(null)
                .isApproved(Boolean.FALSE)
                .isCompleted(Boolean.FALSE)
                .isProcessing(Boolean.FALSE)
                .isStarted(Boolean.FALSE)
                .build();

        Purchase purchase = purchaseRepository.findByToken(model.getToken()).orElseThrow(() ->
                new NotFoundException(String.format("Purchase not found with token: %s", model.getToken())));

        if(COMPLETED.equals(purchase.getStatus())) return PurchaseStatusDTO.builder()
                .id(null)
                .isApproved(Boolean.TRUE)
                .isCompleted(Boolean.TRUE)
                .isProcessing(Boolean.FALSE)
                .isStarted(Boolean.TRUE)
                .items(buildItemsList(purchase.getCartItems()))
                .build();

        if(purchase.pay())
            purchaseRepository.save(purchase);

        return PurchaseStatusDTO.builder()
                .id(purchase.getId())
                .isApproved(Boolean.TRUE)
                .isCompleted(Boolean.FALSE)
                .isProcessing(redisService.isProcessing(purchase.getId()))
                .isStarted(redisService.isStarted(purchase.getId()))
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
