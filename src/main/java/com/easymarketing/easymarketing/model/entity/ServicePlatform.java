package com.easymarketing.easymarketing.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Builder
@Table(name = "service_platforms")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ServicePlatform {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(name = "img_url", nullable = false)
    private String imgUrl;

    @Column(name = "automatic_payment_allowed", nullable = false)
    private Boolean automaticPaymentAllowed;

    @Column(nullable = false)
    private Boolean active;

}
