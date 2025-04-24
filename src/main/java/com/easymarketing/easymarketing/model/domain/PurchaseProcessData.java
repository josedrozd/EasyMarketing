package com.easymarketing.easymarketing.model.domain;

import com.easymarketing.easymarketing.model.dto.FailedCartItemDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseProcessData {

    private Boolean completed;
    @Builder.Default
    private List<FailedCartItemDTO> failedItems = Collections.synchronizedList(new ArrayList<>());

    public void finish(){
        completed = Boolean.TRUE;
    }

}
