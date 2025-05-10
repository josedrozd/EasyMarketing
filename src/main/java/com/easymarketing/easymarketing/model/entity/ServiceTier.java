package com.easymarketing.easymarketing.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Builder
@Table(name = "service_tier")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ServiceTier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer quantity;

    @ManyToOne(optional = false)
    @JoinColumn(name = "quality_id", nullable = false)
    private ServiceQuality quality;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Double discount;

}
