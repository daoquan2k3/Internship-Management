package pka.edu.exception;

import pka.edu.dto.response.ApiResponse;
import pka.edu.util.ValidationErrorUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        FieldError::getDefaultMessage
                ));

        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message("VALIDATION_ERROR")
                .data(null)
                .error(errors)
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message("NOT_FOUND")
                .data(null)
                .error(Map.of("error", ex.getMessage()))
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ResourceConflictException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceConflictException(ResourceConflictException ex) {
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message("CONFLICT")
                .data(null)
                .error(ex.getErrors())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ResourceBadRequestException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceBadRequestException(ResourceBadRequestException ex) {
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message("BAD_REQUEST")
                .data(null)
                .error(ex.getErrors())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceForbiddenException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceForbiddenException(ResourceForbiddenException ex) {
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message("FORBIDDEN")
                .data(null)
                .error(Map.of("error", ex.getMessage()))
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleInvalidCredentialsException(InvalidCredentialsException ex) {
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message("UNAUTHORIZED")
                .data(null)
                .error(Map.of("error", ex.getMessage()))
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneralException(HttpMessageNotReadableException ex) {
        String message = "Invalid request format";

        Map<String, String> errors = ValidationErrorUtil.createErrorMap();

        Throwable rootCause = getRootCause(ex);
        if (rootCause instanceof DateTimeParseException){
            message = "Validation failed";
            errors.put("dateOfBirth", "Invalid date format, please use ISO format (yyyy-MM-dd)");
        }else {
            errors.put("error", message);
        }

        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message(message)
                .data(null)
                .error(errors)
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }


    // Đào sâu cause chain vi no duoc boc nhieu lop
    private Throwable getRootCause(Throwable throwable) {
        while (throwable.getCause() != null) {
            throwable = throwable.getCause();
        }
        return throwable;
    }
}
