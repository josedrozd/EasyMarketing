package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.exception.UnauthorizedException;
import com.easymarketing.easymarketing.model.entity.Purchase;
import com.easymarketing.easymarketing.model.enums.PurchaseStatusEnum;
import com.easymarketing.easymarketing.repository.jpa.PurchaseRepository;
import com.easymarketing.easymarketing.services.interfaces.IRetrievePurchaseByToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DefaultRetrievePurchaseByToken implements IRetrievePurchaseByToken {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Override
    public Long apply(String token) {
        Optional<Purchase> purchase = purchaseRepository.findByToken(token);
        if (purchase.isPresent() && purchase.get().getStatus().equals(PurchaseStatusEnum.PAYED)){
            return purchase.get().getId();
        }
        throw new UnauthorizedException(String.format("Invalid token: %s", token));
    }

}
