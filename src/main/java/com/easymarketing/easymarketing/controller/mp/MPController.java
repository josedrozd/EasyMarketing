package com.easymarketing.easymarketing.controller.mp;

import com.easymarketing.easymarketing.services.interfaces.ICreateMPPreference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/mp")
public class MPController {

    @Autowired
    private ICreateMPPreference iCreateMPPreference;

    @PostMapping("/preferences/create")
    public ResponseEntity<String> createPreference() {
        String id = iCreateMPPreference.apply(List.of()).getId();
        System.out.println(OffsetDateTime.now().toString() + ": " + id);
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

}
