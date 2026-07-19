package pka.edu.exception;

import lombok.Getter;

import java.util.Map;

@Getter
public class ResourceBadRequestException extends Exception{
    private final Map<String, String> errors;
    public ResourceBadRequestException(String message, Map<String, String> errors){
        super(message);
        this.errors = errors;
    }
}
