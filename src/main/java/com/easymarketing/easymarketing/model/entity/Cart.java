package com.easymarketing.easymarketing.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Entity
@Builder
@Table(name = "cart")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "purchase_id")
    private Purchase purchase;

    private String username;

    @Column(name = "platform_id")
    private Integer platformId;

    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "quality_id")
    private Integer qualityId;

    @Column(name = "quantity_id")
    private Integer quantityId;

    private String url;

    private Integer unitQuantity;

    private Boolean processed;

    private OffsetDateTime dateCreated;

    private OffsetDateTime lastUpdate;

    public void process(){
        processed = Boolean.TRUE;
    }

}
