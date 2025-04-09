package com.easymarketing.easymarketing.repository.jpa;

import com.easymarketing.easymarketing.model.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    Optional<Purchase> findByToken(String token);

}
