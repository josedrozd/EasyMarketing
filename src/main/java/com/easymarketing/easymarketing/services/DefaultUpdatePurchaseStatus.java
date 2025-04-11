package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.exception.NotFoundException;
import com.easymarketing.easymarketing.model.dto.PurchaseStatusDTO;
import com.easymarketing.easymarketing.model.entity.Purchase;
import com.easymarketing.easymarketing.repository.api.IRetrieveMPPaymentStatusById;
import com.easymarketing.easymarketing.repository.jpa.PurchaseRepository;
import com.easymarketing.easymarketing.services.interfaces.IUpdatePurchaseStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static com.easymarketing.easymarketing.model.enums.PurchaseStatusEnum.COMPLETED;

@Service
public class DefaultUpdatePurchaseStatus implements IUpdatePurchaseStatus {

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
                .build();

        Optional<Purchase> purchase = purchaseRepository.findByToken(model.getToken());
        if(purchase.isEmpty())
            throw new NotFoundException(String.format("Purchase not found with token: %s", model.getToken()));

        if(COMPLETED.equals(purchase.get().getStatus())) return PurchaseStatusDTO.builder()
                .id(null)
                .isApproved(Boolean.TRUE)
                .isCompleted(Boolean.TRUE)
                .build();

        if(purchase.get().pay())
            purchaseRepository.save(purchase.get());

        return PurchaseStatusDTO.builder()
                .id(purchase.get().getId())
                .isApproved(Boolean.TRUE)
                .isCompleted(Boolean.FALSE)
                .build();
    }

}
