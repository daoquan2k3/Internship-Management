package pka.edu.security.exception;

import pka.edu.security.response.JwtErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {


    public static final String EXPIRED = "ExpiredJwtException";
    public static final String MALFORMED = "MalformedJwtException";
    public static final String SIGNATURE = "SignatureException";
    public static final String UNSUPPORTED = "UnsupportedJwtException";
    public static final String ILLEGAL = "IllegalArgumentException";

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        String error = (String) request.getAttribute("error");

        if (error == null) {
            error = authException.getClass().getSimpleName();
        }

        JwtErrorResponse errorResponse = buildErrorResponse(error);
        response.getWriter().write(new ObjectMapper().writeValueAsString(errorResponse));
        response.getWriter().flush();
        response.getWriter().close();
    }

    private JwtErrorResponse buildErrorResponse(String error) {
        return switch (error) {
            case EXPIRED -> new JwtErrorResponse("Unauthorized", "Token has expired");
            case MALFORMED -> new JwtErrorResponse("Unauthorized", "Token is malformed");
            case SIGNATURE -> new JwtErrorResponse("Unauthorized", "Invalid token signature");
            case UNSUPPORTED -> new JwtErrorResponse("Unauthorized", "Unsupported token type");
            case ILLEGAL -> new JwtErrorResponse("Unauthorized", "Illegal token");
            default -> new JwtErrorResponse("Unauthorized", "Uhm... Something went wrong");
        };
    }
}
