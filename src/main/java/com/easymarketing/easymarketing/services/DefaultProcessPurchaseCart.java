package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.exception.NotFoundException;
import com.easymarketing.easymarketing.exception.UnauthorizedException;
import com.easymarketing.easymarketing.model.domain.PurchaseProcessData;
import com.easymarketing.easymarketing.model.dto.FailedCartItemDTO;
import com.easymarketing.easymarketing.model.entity.Cart;
import com.easymarketing.easymarketing.model.entity.ServiceQuality;
import com.easymarketing.easymarketing.repository.api.IHonestSMMClient;
import com.easymarketing.easymarketing.repository.api.ISMMCostClient;
import com.easymarketing.easymarketing.repository.jpa.CartRepository;
import com.easymarketing.easymarketing.repository.jpa.ServiceQualityRepository;
import com.easymarketing.easymarketing.repository.jpa.ServiceRepository;
import com.easymarketing.easymarketing.services.interfaces.ICompletePurchase;
import com.easymarketing.easymarketing.services.interfaces.IProcessPurchaseCart;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

import static com.easymarketing.easymarketing.utils.PublicMethodsUtil.buildLink;

@Slf4j
@Service
public class DefaultProcessPurchaseCart implements IProcessPurchaseCart {

    @Autowired
    private RedisService redisService;
    @Autowired
    private ICompletePurchase completePurchase;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private IHonestSMMClient honestSMMClient;
    @Autowired
    private ISMMCostClient smmCostClient;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private ServiceQualityRepository serviceQualityRepository;

    @Async
    @Override
    public void accept(Long purchaseId) {
        if(redisService.isProcessing(purchaseId))
            throw new UnauthorizedException(String.format("Another process is being executed for purchase id: %s.", purchaseId));

        PurchaseProcessData response = PurchaseProcessData.builder().completed(Boolean.FALSE).build();
        List<Cart> cartList = cartRepository.findByPurchase_IdAndProcessed(purchaseId, Boolean.FALSE);
        redisService.setProcessing(purchaseId);
        ExecutorService executor = Executors.newFixedThreadPool(4);

        List<CompletableFuture<Void>> futures = cartList
                .stream()
                .map(cart -> CompletableFuture.runAsync(() -> callUrl(cart, response), executor))
                .collect(Collectors.toList());

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        executor.shutdown();

        if (response.getFailedItems().isEmpty()) {
            response.finish();
            completePurchase.accept(purchaseId);
            redisService.removeKey(purchaseId);
        } else {
            redisService.removeProcessing(purchaseId);
        }
    }

    private void callUrl(Cart cart, PurchaseProcessData purchaseProcessData) {
        com.easymarketing.easymarketing.model.entity.Service product = serviceRepository.findById(cart.getProductId())
                .orElseThrow(() -> new NotFoundException("Product does not exist anymore."));
        ServiceQuality quality = serviceQualityRepository.findById(cart.getQualityId())
                .orElseThrow(() -> new NotFoundException("Quality does not exist anymore."));
        String link = buildLink(cart.getUrl(), product.getType());
        Boolean ok = callProvider(cart, link, quality);
        if (ok) {
            cart.process();
            cartRepository.save(cart);
        } else purchaseProcessData.getFailedItems()
                .add(FailedCartItemDTO.builder()
                        .serviceId(quality.getProviderServiceId())
                        .url(link)
                        .quantity(cart.getUnitQuantity())
                        .provider(quality.getProvider().toString())
                        .build());
    }

    private Boolean callProvider(Cart cart, String link, ServiceQuality quality) {
        switch (quality.getProvider()) {
            case SMMCOST -> {
                return smmCostClient.apply(ISMMCostClient.Model.builder()
                        .serviceId(quality.getProviderServiceId())
                        .link(link)
                        .quantity(cart.getUnitQuantity())
                        .username(cart.getUsername())
                        .build());
            }
            case HONEST -> {
                return honestSMMClient.apply(IHonestSMMClient.Model.builder()
                        .serviceId(quality.getProviderServiceId())
                        .link(link)
                        .quantity(cart.getUnitQuantity())
                        .username(cart.getUsername())
                        .build());
            }
            default -> throw new RuntimeException(String.format("No provider defined in the purchase: %s", cart.getPurchase().getId()));
        }
    }

}
