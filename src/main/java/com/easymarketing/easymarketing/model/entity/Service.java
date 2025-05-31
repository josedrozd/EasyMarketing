package com.easymarketing.easymarketing.model.entity;

import com.easymarketing.easymarketing.model.enums.ServiceProductEnum;
import com.easymarketing.easymarketing.model.enums.UrlTypeEnum;
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
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(optional = false)
    @JoinColumn(name = "platform_id", nullable = false)
    private ServicePlatform platform;

    @Column(nullable = false)
    private UrlTypeEnum type;

    @Column(nullable = false)
    private String product;

    @Column(name = "img_url", nullable = false)
    private String imgUrl;

    @Column(nullable = false)
    private Boolean activated;

    @Lob
    @Column(length = 2000, nullable = false)
    private String description;

}