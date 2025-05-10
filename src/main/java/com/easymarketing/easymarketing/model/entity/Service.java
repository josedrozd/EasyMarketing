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

    @Column(nullable = false)
    private String name;

    @ManyToOne(optional = false)
    @JoinColumn(name = "platform_id", nullable = false)
    private ServicePlatform platform;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Boolean activated;

}