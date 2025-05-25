package com.easymarketing.easymarketing.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Builder
@Table(name = "extra_service")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ExtraService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(name = "img_url", nullable = false)
    private String imgUrl;

    @Column(name = "destination_url", nullable = false)
    private String destinationUrl;

    @Column(nullable = false)
    private Boolean active;

}
