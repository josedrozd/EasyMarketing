package com.easymarketing.easymarketing.services.interfaces;

import java.util.function.Function;

@FunctionalInterface
public interface IRetrievePurchaseByToken extends Function<String, Long> {
}
