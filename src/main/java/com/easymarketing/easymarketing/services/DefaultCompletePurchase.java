package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.model.entity.Purchase;
import com.easymarketing.easymarketing.repository.jpa.PurchaseRepository;
import com.easymarketing.easymarketing.services.interfaces.ICompletePurchase;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

public class DefaultCompletePurchase implements ICompletePurchase {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Override
    public void accept(Long purchaseId) {
        Optional<Purchase> purchase = purchaseRepository.findById(purchaseId);

        if(purchase.isPresent()){
            purchase.get().complete();
            purchaseRepository.save(purchase.get());
        }
    }

}
