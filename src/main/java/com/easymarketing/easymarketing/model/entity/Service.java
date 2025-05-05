package com.easymarketing.easymarketing.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Builder
@Table(name = "service")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 20)
    private String platform;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(nullable = false, length = 20)
    private String provider;

    @Column(name = "provider_service_id", nullable = false)
    private Integer providerServiceId;

    @Column(name = "min_quantity")
    private Integer minQuantity;

    @Column(name = "max_quantity")
    private Integer maxQuantity;

    @Column(nullable = false)
    private Integer priority;

    @Column(nullable = false)
    private Boolean activated;

    @Column(name = "automatic_payment", nullable = false)
    private Boolean automaticPayment;

}