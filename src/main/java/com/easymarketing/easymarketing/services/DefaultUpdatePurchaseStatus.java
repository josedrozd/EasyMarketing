package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.exception.NotFoundException;
import com.easymarketing.easymarketing.model.dto.CartItemUnitDTO;
import com.easymarketing.easymarketing.model.dto.FailedCartItemDTO;
import com.easymarketing.easymarketing.model.dto.PurchaseStatusDTO;
import com.easymarketing.easymarketing.model.entity.Cart;
import com.easymarketing.easymarketing.model.entity.Purchase;
import com.easymarketing.easymarketing.model.entity.ServiceQuality;
import com.easymarketing.easymarketing.repository.api.IRetrieveMPPaymentStatusById;
import com.easymarketing.easymarketing.repository.api.ISESEmailService;
import com.easymarketing.easymarketing.repository.jpa.PurchaseRepository;
import com.easymarketing.easymarketing.repository.jpa.ServiceQualityRepository;
import com.easymarketing.easymarketing.repository.jpa.ServiceRepository;
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
    @Autowired
    private ISESEmailService sesEmailService;
    @Autowired
    private ServiceQualityRepository serviceQualityRepository;
    @Autowired
    private ServiceRepository serviceRepository;

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

        if(purchase.pay()) {
            purchaseRepository.save(purchase);
            sesEmailService.accept(ISESEmailService.Model.builder()
                            .to(purchase.getMail())
                            .subject("Tu compra fue aprobada.")
                            .body(buildEmailBody(model.getToken(), model.getPaymentId()))
                    .build());
        }

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

    private String buildEmailBody(String externalReferemce, Long paymentId) {
        return String.format("<html>\n  " +
                "<body>\n    " +
                "<div style=\"text-align:center;\">\n      " +
                "<p>Texto a editar para invitar a q procese la compra:</p>\n      " +
                "<a href=\"https://marketingfacil.com.ar/process-purchase?external_reference=%s&payment_id=%s\" \n         " +
                "style=\"display:inline-block; padding:10px 20px; background-color:#6a0dad; color:white; text-decoration:none; border-radius:5px;\">\n        " +
                "Procesar compra\n      " +
                "</a>\n    " +
                "</div>\n  " +
                "</body>\n" +
                "</html>",
                externalReferemce,
                paymentId.toString()
                );
    }

}
