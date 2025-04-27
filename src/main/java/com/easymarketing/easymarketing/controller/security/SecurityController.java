package com.easymarketing.easymarketing.controller.security;

import com.easymarketing.easymarketing.services.interfaces.ICheckPassword;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@CrossOrigin
@RestController
@RequestMapping("/api/security")
public class SecurityController {

    @Autowired
    private ICheckPassword checkPassword;

    @GetMapping
    public ResponseEntity<Boolean> checkPassword(@RequestParam String password){
        return ResponseEntity.ok(checkPassword.apply(password));
    }

}
