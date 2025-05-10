package com.easymarketing.easymarketing.repository.jpa;

import com.easymarketing.easymarketing.model.entity.ServiceTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ServiceTierRepository extends JpaRepository<ServiceTier, Integer> {

    List<ServiceTier> findByQualityId(Integer qualityId);

    @Modifying
    @Query("DELETE FROM ServiceTier")
    void deleteAllInBulk();

}

