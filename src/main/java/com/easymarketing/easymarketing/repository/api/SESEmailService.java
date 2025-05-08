package com.easymarketing.easymarketing.repository.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.*;

@Slf4j
@Service
public class SESEmailService implements ISESEmailService {

    @Autowired
    private SesClient sesClient;

    @Override
    public void accept(Model model) {
        try {
            Destination destination = Destination.builder().toAddresses(model.getTo()).build();

            Message message = Message.builder()
                    .subject(Content.builder().data(model.getSubject()).build())
                    .body(Body.builder()
                            .html(Content.builder().data(model.getBody()).build())
                            .build())
                    .build();

            SendEmailRequest request = SendEmailRequest.builder()
                    .destination(destination)
                    .message(message)
                    .source("no-reply@marketingfacil.com.ar")
                    .build();

            sesClient.sendEmail(request);
        } catch (Exception e) {
            log.error(String.format("Email could not be sent with exception: %s Error: %s", e.getClass(), e));
        }
    }
}
