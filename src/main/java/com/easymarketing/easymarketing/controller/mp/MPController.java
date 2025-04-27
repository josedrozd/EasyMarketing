package com.easymarketing.easymarketing.controller.mp;

import com.easymarketing.easymarketing.model.dto.PurchaseDTO;
import com.easymarketing.easymarketing.services.interfaces.ICreateMPPreference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/mp")
public class MPController {

    @Autowired
    private ICreateMPPreference iCreateMPPreference;

    @PostMapping("/preferences/create")
    public ResponseEntity<String> createPreference(@RequestBody PurchaseDTO purchase) {
        String id = iCreateMPPreference.apply(purchase).getId();
        System.out.println(OffsetDateTime.now().toString() + ": " + id);
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

}
