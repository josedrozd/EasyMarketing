package com.easymarketing.easymarketing.controller.instagram;

import com.easymarketing.easymarketing.model.dto.IGUserInfoDTO;
import com.easymarketing.easymarketing.model.dto.IGUserMediaDTO;
import com.easymarketing.easymarketing.repository.api.IRetrieveIGMediaByUserId;
import com.easymarketing.easymarketing.repository.api.IRetrieveIGUserByUsername;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@CrossOrigin
@RestController
@RequestMapping("/instagram")
public class InstagramController {

    @Autowired
    private IRetrieveIGUserByUsername retrieveIGUserByUsername;
    @Autowired
    private IRetrieveIGMediaByUserId retrieveIGMediaByUserId;

    @GetMapping("/users/{username}")
    public ResponseEntity<IGUserInfoDTO> getUserInfoByUsername(@Valid @NotBlank @PathVariable String username){
        return ResponseEntity.ok(retrieveIGUserByUsername.apply(username));
    }

    @GetMapping("/users/{userId}/media")
    public ResponseEntity<IGUserMediaDTO> getMediaByUserId(@Valid @NotNull @PathVariable Long userId,
                                                           @RequestParam(value = "maxId", required = false) String maxId) {
        return ResponseEntity.ok(retrieveIGMediaByUserId.apply(IRetrieveIGMediaByUserId.Model.builder()
                .userId(userId)
                .nextMaxId(maxId)
                .build()));
    }

}
