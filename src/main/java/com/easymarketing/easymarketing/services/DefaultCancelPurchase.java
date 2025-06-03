package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.model.entity.Purchase;
import com.easymarketing.easymarketing.repository.jpa.PurchaseRepository;
import com.easymarketing.easymarketing.services.interfaces.ICancelPurchase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DefaultCancelPurchase implements ICancelPurchase {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Override
    public Boolean apply(Long purchaseId) {
        Optional<Purchase> purchase = purchaseRepository.findById(purchaseId);

        if (purchase.isEmpty()) return Boolean.FALSE;

        if (purchase.get().cancel()) {
            purchaseRepository.save(purchase.get());
            return Boolean.TRUE;
        }

        return Boolean.FALSE;
    }

}
