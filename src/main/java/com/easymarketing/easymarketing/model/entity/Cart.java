package com.easymarketing.easymarketing.model.entity;

import com.easymarketing.easymarketing.model.entity.compositekey.CartId;
import com.easymarketing.easymarketing.model.enums.UrlTypeEnum;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Builder
@Table(name = "cart")
@IdClass(CartId.class)
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Cart {

    @Id
    @ManyToOne
    @JoinColumn(name = "purchase_id")
    private Purchase purchase;

    @Id
    @Column(name = "service_id")
    private Integer serviceId;

    @Id
    private String url;

    private Integer quantity;

    @Column(name = "url_type")
    @Enumerated(EnumType.STRING)
    private UrlTypeEnum urlType;

    private Boolean processed;

    public void process(){
        processed = Boolean.TRUE;
    }

}
