package com.easymarketing.easymarketing.repository.jpa;

import com.easymarketing.easymarketing.model.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Integer> {

    List<Service> findByPlatformId(Integer platformId);
    @Modifying
    @Query("DELETE FROM Service")
    void deleteAllInBulk();

}
