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
                            .id(platformDTO.getId())
                            .name(platformDTO.getName())
                            .platform(platformDTO.getPlatform())
                            .imgUrl(platformDTO.getImgUrl())
                            .automaticPaymentAllowed(platformDTO.getAutomaticPaymentAllowed())
                            .active(platformDTO.getActive())
                            .build();
                    platformsToSave.add(platform);

                    platformDTO.getChildren().get(0).getChildren().stream()
                            .map(ServiceDTO.class::cast)
                            .forEach(serviceNode -> {
                                com.easymarketing.easymarketing.model.entity.Service service = com.easymarketing.easymarketing.model.entity.Service.builder()
                                        .id(serviceNode.getId())
                                        .name(serviceNode.getName())
                                        .product(serviceNode.getProduct())
                                        .platform(platform)
                                        .type(serviceNode.getType())
                                        .imgUrl(serviceNode.getImgUrl())
                                        .activated(serviceNode.getActivated())
                                        .description(serviceNode.getDescription())
                                        .build();
                                servicesToSave.add(service);

                                serviceNode.getChildren().get(0).getChildren().stream()
                                        .map(QualityDTO.class::cast)
                                        .forEach(qualityNode -> {
                                            ServiceQuality quality = ServiceQuality.builder()
                                                    .id(qualityNode.getId())
                                                    .service(service)
                                                    .name(qualityNode.getName())
                                                    .provider(qualityNode.getProvider())
                                                    .providerServiceId(qualityNode.getProviderServiceId())
                                                    .minimum(qualityNode.getMinimum())
                                                    .priority(qualityNode.getPriority())
                                                    .automaticPayment(qualityNode.getAutomaticPayment())
                                                    .activated(qualityNode.getActivated())
                                                    .description(qualityNode.getDescription())
                                                    .build();
                                            qualitiesToSave.add(quality);

                                            qualityNode.getChildren().get(0).getChildren().stream()
                                                    .map(QuantityDTO.class::cast)
                                                    .forEach(tierNode -> {
                                                        ServiceTier tier = ServiceTier.builder()
                                                                .id(tierNode.getId())
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
                            .id(extraDTO.getId())
                            .name(extraDTO.getName())
                            .imgUrl(extraDTO.getImgUrl())
                            .destinationUrl(extraDTO.getDestinationUrl())
                            .active(extraDTO.getActive())
                            .build();
                    extrasToSave.add(extra);
                });


        List<Integer> platformIds = platformsToSave.stream().map(ServicePlatform::getId).toList();
        servicePlatformRepository.deleteAll(servicePlatformRepository.findAll().stream()
                        .filter(p -> !platformIds.contains(p.getId()))
                        .toList());
        List<Integer> serviceIds = servicesToSave.stream().map(com.easymarketing.easymarketing.model.entity.Service::getId).toList();
        serviceRepository.deleteAll(serviceRepository.findAll().stream()
                        .filter(s -> !serviceIds.contains(s.getId()))
                        .toList());
        List<Integer> qualityIds = qualitiesToSave.stream().map(ServiceQuality::getId).toList();
        serviceQualityRepository.deleteAll(serviceQualityRepository.findAll().stream()
                        .filter(q -> !qualityIds.contains(q.getId()))
                        .toList());
        List<Integer> tierIds = tiersToSave.stream().map(ServiceTier::getId).toList();
        serviceTierRepository.deleteAll(serviceTierRepository.findAll().stream()
                        .filter(t -> !tierIds.contains(t.getId()))
                        .toList());
        List<Integer> extraIds = extrasToSave.stream().map(ExtraService::getId).toList();
        extraServiceRepository.deleteAll(extraServiceRepository.findAll().stream()
                        .filter(e -> !extraIds.contains(e.getId()))
                        .toList());

        servicePlatformRepository.saveAll(platformsToSave);
        serviceRepository.saveAll(servicesToSave);
        serviceQualityRepository.saveAll(qualitiesToSave);
        serviceTierRepository.saveAll(tiersToSave);
        extraServiceRepository.saveAll(extrasToSave);

    }

}
