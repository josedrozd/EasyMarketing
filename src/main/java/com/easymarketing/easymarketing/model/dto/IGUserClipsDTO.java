package com.easymarketing.easymarketing.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IGUserClipsDTO {

    private Boolean moreAvailable;
    private String nextMaxId;
    private List<IGReelClipDTO> reelClips;

}
