package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.model.domain.PurchaseProcessData;
import com.easymarketing.easymarketing.model.dto.FailedCartItemDTO;
import com.easymarketing.easymarketing.model.entity.Cart;
import com.easymarketing.easymarketing.model.enums.UrlTypeEnum;
import com.easymarketing.easymarketing.repository.api.IHonestSMMClient;
import com.easymarketing.easymarketing.repository.api.ISMMCostClient;
import com.easymarketing.easymarketing.repository.jpa.CartRepository;
import com.easymarketing.easymarketing.services.interfaces.ICompletePurchase;
import com.easymarketing.easymarketing.services.interfaces.IProcessPurchaseCart;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DefaultProcessPurchaseCart implements IProcessPurchaseCart {

    @Autowired
    private ICompletePurchase completePurchase;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private IHonestSMMClient honestSMMClient;
    @Autowired
    private ISMMCostClient smmCostClient;

    @Override
    public PurchaseProcessData apply(Long purchaseId) {
        PurchaseProcessData response = PurchaseProcessData.builder().completed(Boolean.FALSE).build();
        List<Cart> cartList = cartRepository.findByPurchase_IdAndProcessed(purchaseId, Boolean.FALSE);

        List<CompletableFuture<Void>> futures = cartList
                .stream()
                .map(cart -> CompletableFuture.runAsync(() -> callUrl(cart, response)))
                .collect(Collectors.toList());

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        if (response.getFailedItems().isEmpty()) response.finish();

        if (response.getCompleted()) completePurchase.accept(purchaseId);

        cartRepository.saveAll(cartList);

        return response;
    }

    private void callUrl(Cart cart, PurchaseProcessData purchaseProcessData) {
        String link = buildLink(cart.getUrl(), cart.getUrlType());
        Boolean ok = callProvider(cart, link);
        if (ok) cart.process();
        else purchaseProcessData.getFailedItems()
                .add(FailedCartItemDTO.builder()
                        .serviceId(cart.getServiceId())
                        .url(link)
                        .quantity(cart.getQuantity())
                        .provider(cart.getProvider().toString())
                        .build());
    }

    private Boolean callProvider(Cart cart, String link) {
        switch (cart.getProvider()){
            case SMMCOST -> {
                return smmCostClient.apply(ISMMCostClient.Model.builder()
                        .serviceId(cart.getServiceId())
                        .link(link)
                        .quantity(cart.getQuantity())
                        .username(cart.getUsername())
                        .build());
            }
            case HONEST -> {
                return honestSMMClient.apply(IHonestSMMClient.Model.builder()
                        .serviceId(cart.getServiceId())
                        .link(link)
                        .quantity(cart.getQuantity())
                        .username(cart.getUsername())
                        .build());
            }
            default -> throw new RuntimeException(String.format("No provider defined in the purchase: %s", cart.getPurchase().getId()));
        }
    }

    private String buildLink(String url, UrlTypeEnum type){
        if (type == UrlTypeEnum.POST){
            return String.format("https://www.instagram.com/p/%s/", url);
        } else if (type == UrlTypeEnum.PROFILE){
            return String.format("https://www.instagram.com/%s/", url);
        } else {
            throw new RuntimeException("Invalid urlType");
        }
    }

}
