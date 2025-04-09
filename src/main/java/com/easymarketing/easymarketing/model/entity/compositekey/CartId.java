package com.easymarketing.easymarketing.model.entity.compositekey;

import java.io.Serializable;
import java.util.Objects;

public class CartId implements Serializable {

    private Integer purchase;
    private Integer serviceId;
    private String url;

    public CartId() {}

    public CartId(Integer purchase, Integer serviceId, String url) {
        this.purchase = purchase;
        this.serviceId = serviceId;
        this.url = url;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CartId)) return false;
        CartId cartId = (CartId) o;
        return Objects.equals(purchase, cartId.purchase) &&
                Objects.equals(serviceId, cartId.serviceId) &&
                Objects.equals(url, cartId.url);
    }

    @Override
    public int hashCode() {
        return Objects.hash(purchase, serviceId, url);
    }
}
