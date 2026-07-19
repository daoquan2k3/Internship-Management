package pka.edu.exception;

import lombok.Getter;

@Getter
public class ResourceForbiddenException extends Exception{
    public ResourceForbiddenException(String message){
        super(message);
    }
}
