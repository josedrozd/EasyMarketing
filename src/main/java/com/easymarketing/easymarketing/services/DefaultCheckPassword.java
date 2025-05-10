package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.services.interfaces.ICheckPassword;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class DefaultCheckPassword implements ICheckPassword {

    @Value("${admin.password}")
    private String adminPassword;

    @Override
    public Boolean apply(String password, HttpSession session) {
        Boolean logged = adminPassword.equals(password);
        if (logged) session.setAttribute("isLoggedIn", true);
        return logged;
    }
}
