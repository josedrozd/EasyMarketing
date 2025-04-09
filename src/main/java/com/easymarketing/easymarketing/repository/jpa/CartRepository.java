package com.easymarketing.easymarketing.repository.jpa;

import com.easymarketing.easymarketing.model.entity.Cart;
import com.easymarketing.easymarketing.model.entity.compositekey.CartId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository extends JpaRepository<Cart, CartId> {

    List<Cart> findByPurchase_Id(Long purchaseId);

    List<Cart> findByPurchase_IdAndProcessed(Long purchaseId, Boolean processed);

}