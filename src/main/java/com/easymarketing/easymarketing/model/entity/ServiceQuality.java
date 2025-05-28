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
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Column(nullable = false, length = 50)
    private String name;

    private String provider;

    @Column(name = "provider_service_id")
    private Integer providerServiceId;

    private Integer minimum;

    @Column(nullable = false)
    private Integer priority;

    @Column(name = "automatic_payment", nullable = false)
    private Boolean automaticPayment;

    @Column(nullable = false)
    private Boolean activated;

    @Lob
    @Column(length = 1000, nullable = false)
    private String description;

}
