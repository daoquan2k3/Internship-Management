package pka.edu.exception;

import lombok.Getter;

import java.util.Map;

@Getter
public class ResourceConflictException extends Exception{
    private final Map<String, String> errors;

    public ResourceConflictException(String message, Map<String, String> errors) {
        super(message);
        this.errors = errors;
    }

}
