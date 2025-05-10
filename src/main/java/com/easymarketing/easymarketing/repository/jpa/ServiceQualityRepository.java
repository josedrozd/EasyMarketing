package com.easymarketing.easymarketing.repository.jpa;

import com.easymarketing.easymarketing.model.entity.ServiceQuality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ServiceQualityRepository extends JpaRepository<ServiceQuality, Integer> {

    List<ServiceQuality> findByServiceId(Integer serviceId);
    @Modifying
    @Query("DELETE FROM ServiceQuality")
    void deleteAllInBulk();

}
