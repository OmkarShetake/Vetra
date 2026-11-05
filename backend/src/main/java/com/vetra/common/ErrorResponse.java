package com.vetra.common;

import java.time.Instant;
import java.util.Map;

public record ErrorResponse(
    String error,
    String message,
    Instant timestamp,
    Map<String, String> validationErrors
) {
    public ErrorResponse(String error, String message) {
        this(error, message, Instant.now(), null);
    }
}
