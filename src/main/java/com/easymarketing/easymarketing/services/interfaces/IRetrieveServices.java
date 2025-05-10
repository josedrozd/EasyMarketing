package com.easymarketing.easymarketing.services.interfaces;

import com.easymarketing.easymarketing.model.dto.services.NodeDTO;

import java.util.List;
import java.util.function.Supplier;

@FunctionalInterface
public interface IRetrieveServices extends Supplier<List<NodeDTO>> {
}
