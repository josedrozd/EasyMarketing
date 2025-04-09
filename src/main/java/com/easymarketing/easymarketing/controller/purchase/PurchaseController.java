package com.easymarketing.easymarketing.controller.purchase;

import com.easymarketing.easymarketing.model.domain.PurchaseProcessData;
import com.easymarketing.easymarketing.services.interfaces.IProcessPurchaseCart;
import com.easymarketing.easymarketing.services.interfaces.IRetrievePurchaseByToken;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/purchases")
public class PurchaseController {

    @Autowired
    private IRetrievePurchaseByToken retrievePurchaseByToken;
    @Autowired
    private IProcessPurchaseCart processPurchaseCart;

    @GetMapping("/tokens/{tokenId}")
    public ResponseEntity<Long> getIdByToken(@Valid @NotBlank @PathVariable String tokenId){
        return ResponseEntity.ok(retrievePurchaseByToken.apply(tokenId));
    }

    @PostMapping("/{purchaseId}/process")
    public ResponseEntity<PurchaseProcessData> processPurchaseById(@Valid @NotNull @PathVariable Long purchaseId){
        return ResponseEntity.ok(processPurchaseCart.apply(purchaseId));
    }

}
