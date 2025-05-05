package com.easymarketing.easymarketing.repository.jpa;

import com.easymarketing.easymarketing.model.entity.ServiceTier;
import com.easymarketing.easymarketing.model.entity.compositeIds.ServiceTierId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceTierRepository extends JpaRepository<ServiceTier, ServiceTierId> {
}

