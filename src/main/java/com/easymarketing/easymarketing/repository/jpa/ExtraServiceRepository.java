package com.easymarketing.easymarketing.repository.jpa;

import com.easymarketing.easymarketing.model.entity.ExtraService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ExtraServiceRepository extends JpaRepository<ExtraService, Integer> {

    @Modifying
    @Query("DELETE FROM ExtraService")
    void deleteAllInBulk();

}
