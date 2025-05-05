package com.easymarketing.easymarketing.model.entity.compositeIds;

import java.io.Serializable;
import java.util.Objects;

public class ServiceTierId implements Serializable {

    private Integer quantity;
    private Integer quality;


    public ServiceTierId() {}

    public ServiceTierId(Integer quantity, Integer quality) {
        this.quantity = quantity;
        this.quality = quality;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ServiceTierId)) return false;
        ServiceTierId that = (ServiceTierId) o;
        return Objects.equals(quantity, that.quantity) &&
                Objects.equals(quality, that.quality);
    }

    @Override
    public int hashCode() {
        return Objects.hash(quantity, quality);
    }

}
