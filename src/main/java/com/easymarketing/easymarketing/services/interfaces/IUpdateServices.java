package com.easymarketing.easymarketing.services.interfaces;

import com.easymarketing.easymarketing.model.dto.services.NodeDTO;

import java.util.List;
import java.util.function.Consumer;

@FunctionalInterface
public interface IUpdateServices extends Consumer<List<NodeDTO>> {
}
