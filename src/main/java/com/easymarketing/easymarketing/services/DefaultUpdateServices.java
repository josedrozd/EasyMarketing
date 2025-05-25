package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.model.dto.services.*;
import com.easymarketing.easymarketing.model.entity.ExtraService;
import com.easymarketing.easymarketing.model.entity.ServicePlatform;
import com.easymarketing.easymarketing.model.entity.ServiceQuality;
import com.easymarketing.easymarketing.model.entity.ServiceTier;
import com.easymarketing.easymarketing.repository.jpa.*;
import com.easymarketing.easymarketing.services.interfaces.IUpdateServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class DefaultUpdateServices implements IUpdateServices {

    @Autowired
    private ServicePlatformRepository servicePlatformRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private ServiceQualityRepository serviceQualityRepository;
    @Autowired
    private ServiceTierRepository serviceTierRepository;
    @Autowired
    private ExtraServiceRepository extraServiceRepository;

    @Transactional
    @Override
    public void accept(List<NodeDTO> treeData) {

        List<ServicePlatform> platformsToSave = new ArrayList<>();
        List<com.easymarketing.easymarketing.model.entity.Service> servicesToSave = new ArrayList<>();
        List<ServiceQuality> qualitiesToSave = new ArrayList<>();
        List<ServiceTier> tiersToSave = new ArrayList<>();
        List<ExtraService> extrasToSave = new ArrayList<>();

        treeData.stream().filter(node -> node.getNodeType().equals("platform-group")).findFirst().get().getChildren().stream()
                .map(PlatformDTO.class::cast)
                .forEach(platformDTO -> {
                    ServicePlatform platform = ServicePlatform.builder()
                            .name(platformDTO.getName())
                            .imgUrl(platformDTO.getImgUrl())
                            .automaticPaymentAllowed(platformDTO.getAutomaticPaymentAllowed())
                            .active(platformDTO.getActive())
                            .build();
                    platformsToSave.add(platform);

                    platformDTO.getChildren().get(0).getChildren().stream()
                            .map(ServiceDTO.class::cast)
                            .forEach(serviceNode -> {
                                com.easymarketing.easymarketing.model.entity.Service service = com.easymarketing.easymarketing.model.entity.Service.builder()
                                        .name(serviceNode.getName())
                                        .platform(platform)
                                        .type(serviceNode.getType())
                                        .imgUrl(serviceNode.getImgUrl())
                                        .activated(serviceNode.getActivated())
                                        .build();
                                servicesToSave.add(service);

                                serviceNode.getChildren().get(0).getChildren().stream()
                                        .map(QualityDTO.class::cast)
                                        .forEach(qualityNode -> {
                                            ServiceQuality quality = ServiceQuality.builder()
                                                    .service(service)
                                                    .name(qualityNode.getName())
                                                    .provider(qualityNode.getProvider())
                                                    .providerServiceId(qualityNode.getProviderServiceId())
                                                    .priority(qualityNode.getPriority())
                                                    .automaticPayment(qualityNode.getAutomaticPayment())
                                                    .activated(qualityNode.getActivated())
                                                    .build();
                                            qualitiesToSave.add(quality);

                                            qualityNode.getChildren().get(0).getChildren().stream()
                                                    .map(QuantityDTO.class::cast)
                                                    .forEach(tierNode -> {
                                                        ServiceTier tier = ServiceTier.builder()
                                                                .quantity(tierNode.getQuantity())
                                                                .quality(quality)
                                                                .withDiscount(tierNode.getWithDiscount())
                                                                .basePrice(tierNode.getBasePrice())
                                                                .finalPrice(tierNode.getFinalPrice())
                                                                .discount(tierNode.getDiscount())
                                                                .build();
                                                        tiersToSave.add(tier);
                                                    });
                                        });
                            });
                });
        treeData.stream().filter(node -> node.getNodeType().equals("extra-group")).findFirst().get().getChildren().stream()
                .map(ExtraDTO.class::cast)
                .forEach(extraDTO -> {
                    ExtraService extra = ExtraService.builder()
                            .name(extraDTO.getName())
                            .imgUrl(extraDTO.getImgUrl())
                            .destinationUrl(extraDTO.getDestinationUrl())
                            .active(extraDTO.getActive())
                            .build();
                    extrasToSave.add(extra);
                });

        serviceTierRepository.deleteAllInBulk();
        serviceQualityRepository.deleteAllInBulk();
        serviceRepository.deleteAllInBulk();
        servicePlatformRepository.deleteAllInBulk();
        extraServiceRepository.deleteAllInBulk();

        servicePlatformRepository.saveAll(platformsToSave);
        serviceRepository.saveAll(servicesToSave);
        serviceQualityRepository.saveAll(qualitiesToSave);
        serviceTierRepository.saveAll(tiersToSave);
        extraServiceRepository.saveAll(extrasToSave);

    }

}
