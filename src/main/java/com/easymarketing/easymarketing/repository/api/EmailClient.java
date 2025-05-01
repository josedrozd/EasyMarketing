package com.easymarketing.easymarketing.repository.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailClient implements IEmailClient{

    @Autowired
    private JavaMailSender mailSender;

    public void accept(IEmailClient.Model model) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(model.getTo());
            mail.setSubject(model.getSubject());
            mail.setText(model.getBody());
            mail.setFrom("drozd.jose@gmail.com");

            mailSender.send(mail);
        } catch (Exception e) {
            log.error(String.format("Email could not be sent with exception: %s Error: %s", e.getClass(), e));
        }
    }

}
