package com.easymarketing.easymarketing.repository.jpa;

import com.easymarketing.easymarketing.model.entity.ServicePlatform;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ServicePlatformRepository extends JpaRepository<ServicePlatform, Integer> {

    @Modifying
    @Query("DELETE FROM ServicePlatform")
    void deleteAllInBulk();

}
