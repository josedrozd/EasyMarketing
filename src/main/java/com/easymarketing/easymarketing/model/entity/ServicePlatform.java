package com.easymarketing.easymarketing.model.entity;

import com.easymarketing.easymarketing.model.enums.PlatformEnum;
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
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String platform;

    @Column(name = "img_url", nullable = false)
    private String imgUrl;

    @Column(name = "automatic_payment_allowed", nullable = false)
    private Boolean automaticPaymentAllowed;

    @Column(nullable = false)
    private Boolean active;

}
