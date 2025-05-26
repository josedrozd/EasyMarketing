package com.easymarketing.easymarketing.services;

import com.easymarketing.easymarketing.model.dto.services.*;
import com.easymarketing.easymarketing.model.entity.ExtraService;
import com.easymarketing.easymarketing.model.entity.ServicePlatform;
import com.easymarketing.easymarketing.model.entity.ServiceQuality;
import com.easymarketing.easymarketing.model.entity.ServiceTier;
import com.easymarketing.easymarketing.repository.jpa.*;
import com.easymarketing.easymarketing.services.interfaces.IRetrieveServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DefaultRetrieveServices implements IRetrieveServices {

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

    @Override
    public List<NodeDTO> get() {
        List<ServicePlatform> platforms = servicePlatformRepository.findAll();
        List<ExtraService> extras = extraServiceRepository.findAll();
        return List.of(NodeDTO.builder()
                        .id(UUID.randomUUID().toString())
                        .nodeType("platform-group")
                        .name("PLATAFORMAS:")
                        .group(true)
                        .children(platforms.stream()
                                .map(platform -> (NodeDTO) PlatformDTO.builder()
                                        .id("p"+platform.getId().toString())
                                        .nodeType("platform")
                                        .name(platform.getName())
                                        .group(false)
                                        .children(buildServicesGroup(platform.getId()))
                                        .expanded(false)
                                        .editing(false)
                                        .imgUrl(platform.getImgUrl())
                                        .automaticPaymentAllowed(platform.getAutomaticPaymentAllowed())
                                        .active(platform.getActive())
                                        .build())
                                .toList())
                        .expanded(false)
                        .editing(false)
                        .build(),
                        NodeDTO.builder()
                                .id(UUID.randomUUID().toString())
                                .nodeType("extra-group")
                                .name("EXTRAS:")
                                .group(true)
                                .children(extras.stream()
                                        .map(extra -> (NodeDTO) ExtraDTO.builder()
                                                .id("e"+extra.getId().toString())
                                                .nodeType("extra")
                                                .name(extra.getName())
                                                .group(false)
                                                .children(null)
                                                .expanded(false)
                                                .editing(false)
                                                .imgUrl(extra.getImgUrl())
                                                .destinationUrl(extra.getDestinationUrl())
                                                .active(extra.getActive())
                                                .build())
                                        .toList())
                                .expanded(false)
                                .editing(false)
                                .build()
                );
    }

    private List<NodeDTO> buildServicesGroup(Integer platformId) {
        List<com.easymarketing.easymarketing.model.entity.Service> services = serviceRepository.findByPlatformId(platformId);
        return List.of(NodeDTO.builder()
                .id(UUID.randomUUID().toString())
                .nodeType("service-group")
                .name("SERVICIOS:")
                .group(true)
                .children(services.stream()
                        .map(service -> (NodeDTO) ServiceDTO.builder()
                                .id("s"+service.getId().toString())
                                .nodeType("service")
                                .name(service.getName())
                                .group(false)
                                .children(buildQualitiesGroup(service.getId()))
                                .expanded(false)
                                .editing(false)
                                .type(service.getType())
                                .imgUrl(service.getImgUrl())
                                .activated(service.getActivated())
                                .build())
                        .toList())
                .expanded(false)
                .editing(false)
                .build());
    }

    private List<NodeDTO> buildQualitiesGroup(Integer serviceId) {
        List<ServiceQuality> qualities = serviceQualityRepository.findByServiceId(serviceId);
        return List.of(NodeDTO.builder()
                .id(UUID.randomUUID().toString())
                .nodeType("quality-group")
                .name("CALIDADES:")
                .group(true)
                .children(qualities.stream()
                        .map(quality -> (NodeDTO) QualityDTO.builder()
                                .id("q"+quality.getId().toString())
                                .nodeType("quality")
                                .name(quality.getName())
                                .group(false)
                                .children(buildQuantitiesGroup(quality.getId()))
                                .expanded(false)
                                .editing(false)
                                .provider(quality.getProvider())
                                .providerServiceId(quality.getProviderServiceId())
                                .minimum(quality.getMinimum())
                                .priority(quality.getPriority())
                                .automaticPayment(quality.getAutomaticPayment())
                                .activated(quality.getActivated())
                                .description(quality.getDescription())
                                .build())
                        .toList())
                .expanded(false)
                .editing(false)
                .build());
    }

    private List<NodeDTO> buildQuantitiesGroup(Integer qualityId) {
        List<ServiceTier> tiers = serviceTierRepository.findByQualityId(qualityId);
        return List.of(NodeDTO.builder()
                .id(UUID.randomUUID().toString())
                .nodeType("quantity-group")
                .name("CANTIDADES:")
                .group(true)
                .children(tiers.stream()
                        .map(tier -> (NodeDTO) QuantityDTO.builder()
                                .id("t"+tier.getId().toString())
                                .nodeType("quantity")
                                .name(tier.getQuantity().toString())
                                .group(false)
                                .children(null)
                                .expanded(false)
                                .editing(false)
                                .quantity(tier.getQuantity())
                                .withDiscount(tier.getWithDiscount())
                                .basePrice(tier.getBasePrice())
                                .finalPrice(tier.getFinalPrice())
                                .discount(tier.getDiscount())
                                .build())
                        .toList())
                .expanded(false)
                .editing(false)
                .build());
    }

}
