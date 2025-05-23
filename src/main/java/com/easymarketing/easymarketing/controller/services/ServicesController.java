package com.easymarketing.easymarketing.controller.services;

import com.easymarketing.easymarketing.exception.NotFoundException;
import com.easymarketing.easymarketing.exception.UnauthorizedException;
import com.easymarketing.easymarketing.model.dto.services.NodeDTO;
import com.easymarketing.easymarketing.services.interfaces.IRetrieveServices;
import com.easymarketing.easymarketing.services.interfaces.IUpdateServices;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@CrossOrigin
@RestController
@RequestMapping("/api/services")
public class ServicesController {

    @Autowired
    private IRetrieveServices retrieveServices;
    @Autowired
    private IUpdateServices updateServices;


    @GetMapping()
    public ResponseEntity<List<NodeDTO>> retrieveServices(HttpSession session) {
        //validateSession(session);
        return ResponseEntity.ok(retrieveServices.get());
    }

    @PutMapping()
    public ResponseEntity<Void> updateServices(@Valid @NotNull @RequestBody List<NodeDTO> treeNode, HttpSession session) throws JsonProcessingException {
        validateSession(session);
        updateServices.accept(treeNode);
        return ResponseEntity.accepted().build();
    }

    private void validateSession(HttpSession session) {
        Object loggedInAttr = session.getAttribute("isLoggedIn");
        if (loggedInAttr == null)
            throw new UnauthorizedException("Su sesión expiro.");
        if (!(Boolean) loggedInAttr)
            throw new NotFoundException("Nothing found");
    }

}
