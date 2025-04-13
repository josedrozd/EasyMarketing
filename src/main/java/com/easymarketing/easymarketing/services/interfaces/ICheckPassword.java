package com.easymarketing.easymarketing.services.interfaces;

import java.util.function.Function;

@FunctionalInterface
public interface ICheckPassword extends Function<String, Boolean> {
}
