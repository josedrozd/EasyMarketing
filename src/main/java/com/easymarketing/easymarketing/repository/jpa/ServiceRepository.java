package com.easymarketing.easymarketing.repository.jpa;

import com.easymarketing.easymarketing.model.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository extends JpaRepository<Service, Integer> {
}
