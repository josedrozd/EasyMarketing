package com.easymarketing.easymarketing.controller.ping;

import com.easymarketing.easymarketing.exception.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
public class PingController {

    @GetMapping("/api/ping")
    public ResponseEntity<String> ping(){
        return ResponseEntity.ok("pong");
    }

}
