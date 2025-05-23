package com.easymarketing.easymarketing.model.dto.services;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.EXISTING_PROPERTY,
        property = "nodeType",
        visible = true
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = PlatformDTO.class, name = "platform"),
        @JsonSubTypes.Type(value = ServiceDTO.class, name = "service"),
        @JsonSubTypes.Type(value = QualityDTO.class, name = "quality"),
        @JsonSubTypes.Type(value = QuantityDTO.class, name = "quantity"),
        @JsonSubTypes.Type(value = ExtraDTO.class, name = "extra"),
        @JsonSubTypes.Type(value = NodeDTO.class, name = "platform-group"),
        @JsonSubTypes.Type(value = NodeDTO.class, name = "service-group"),
        @JsonSubTypes.Type(value = NodeDTO.class, name = "quality-group"),
        @JsonSubTypes.Type(value = NodeDTO.class, name = "quantity-group"),
        @JsonSubTypes.Type(value = NodeDTO.class, name = "extra-group")
})
@Getter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class NodeDTO {

    private String id;
    private String nodeType;
    private String name;
    private Boolean group;
    private List<NodeDTO> children;
    private Boolean expanded;
    private Boolean editing;

}
