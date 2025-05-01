package com.easymarketing.easymarketing.controller.email;

import com.easymarketing.easymarketing.model.dto.EmailDTO;
import com.easymarketing.easymarketing.repository.api.IEmailClient;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@CrossOrigin
@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private IEmailClient emailClient;

    @PostMapping()
    public ResponseEntity<Void> sendMail(@Valid @NotNull @RequestBody EmailDTO email) {
        emailClient.accept(IEmailClient.Model.builder()
                        .to(email.getTo())
                        .subject(email.getSubject())
                        .body(email.getBody())
                        .build());
        return ResponseEntity.ok().build();
    }

}
