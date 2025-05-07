package com.easymarketing.easymarketing.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Builder
@Table(name = "service_quality")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ServiceQuality {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false)
    private String provider;

    @Column(name = "provider_service_id")
    private Integer providerServiceId;

    @Column(nullable = false)
    private Integer priority;

}
