package com.easymarketing.easymarketing.model.entity;

import com.easymarketing.easymarketing.model.entity.compositeIds.ServiceTierId;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Builder
@Table(name = "service_tier")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@IdClass(ServiceTierId.class)
public class ServiceTier {

    @Id
    private Integer quantity;

    @Id
    @ManyToOne(optional = false)
    @JoinColumn(name = "quality_id", nullable = false)
    private ServiceQuality quality;

    @Column(nullable = false)
    private Double price;

    @Column
    private Double discount;

}
