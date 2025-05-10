package com.easymarketing.easymarketing.services.interfaces;

import jakarta.servlet.http.HttpSession;

import java.util.function.BiFunction;

@FunctionalInterface
public interface ICheckPassword extends BiFunction<String, HttpSession, Boolean> {
}
