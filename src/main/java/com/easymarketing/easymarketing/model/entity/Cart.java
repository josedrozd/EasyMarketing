package com.easymarketing.easymarketing.model.entity;

import com.easymarketing.easymarketing.model.enums.ServiceProviderEnum;
import com.easymarketing.easymarketing.model.enums.UrlTypeEnum;
import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "service_id")
    private Integer serviceId;

    private String url;

    private Integer quantity;

    @Column(name = "url_type")
    @Enumerated(EnumType.STRING)
    private UrlTypeEnum urlType;

    @Enumerated(EnumType.STRING)
    private ServiceProviderEnum provider;

    private Boolean processed;

    public void process(){
        processed = Boolean.TRUE;
    }

}
