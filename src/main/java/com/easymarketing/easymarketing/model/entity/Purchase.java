package com.easymarketing.easymarketing.model.entity;

import com.easymarketing.easymarketing.model.enums.PurchaseStatusEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Builder
@Table(name = "purchase")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    private String mail;

    private String name;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "total_price")
    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    private PurchaseStatusEnum status;

    private OffsetDateTime date;

    @OneToMany(mappedBy = "purchase", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Cart> cartItems = new ArrayList<>();

    public void complete(){
        status = PurchaseStatusEnum.COMPLETED;
    }

    public boolean pay(){
        if(!PurchaseStatusEnum.COMPLETED.equals(status) && !PurchaseStatusEnum.PAYED.equals(status) && !PurchaseStatusEnum.CANCELED.equals(status)){
            status = PurchaseStatusEnum.PAYED;
            return true;
        }
        return false;
    }

    public boolean cancel() {
        if (PurchaseStatusEnum.PAYED.equals(status)) {
            status = PurchaseStatusEnum.CANCELED;
            return true;
        }
        return false;
    }

}
