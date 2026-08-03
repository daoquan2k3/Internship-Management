package pka.edu.exception;

import lombok.Getter;

import java.util.Map;

@Getter
public class ResourceConflictException extends RuntimeException {
    private final Map<String, String> errors;

    public ResourceConflictException(String message, Map<String, String> errors) {
        super(message);
        this.errors = errors;
    }

    public ResourceConflictException(String message) {
        super(message);
        this.errors = null;
    }
}
