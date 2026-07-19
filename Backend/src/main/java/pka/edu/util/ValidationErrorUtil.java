package pka.edu.util;

import java.util.HashMap;
import java.util.Map;

public class ValidationErrorUtil {

    private ValidationErrorUtil() {

    }

    public static Map<String, String> createErrorMap() {
        return new HashMap<>();
    }


    public static boolean hasErrors(Map<String, String> errorMap) {
        return errorMap != null && !errorMap.isEmpty();
    }

    public static void addError(Map<String, String> errorMap, String key, String message) {
        if (errorMap != null) {
            errorMap.put(key, message);
        }
    }
}

