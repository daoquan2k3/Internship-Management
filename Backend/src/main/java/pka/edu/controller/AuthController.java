package pka.edu.controller;

import pka.edu.dto.request.ForgotPasswordRequest;
import pka.edu.dto.request.FormLoginRequest;
import pka.edu.dto.request.FormRegisterRequest;
import pka.edu.dto.request.ResetPasswordRequest;
import pka.edu.dto.response.*;
import pka.edu.exception.InvalidCredentialsException;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.service.IAuthService;
import pka.edu.service.impl.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.naming.AuthenticationException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final IAuthService authService;
    private final PasswordResetService passwordResetService;

    @Value("${jwt_expire}")
    private long expire;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@Valid @RequestBody FormRegisterRequest request) throws ResourceConflictException, ResourceBadRequestException {
        ApiResponse<RegisterResponse> response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody FormLoginRequest request) throws ResourceConflictException, AuthenticationException, InvalidCredentialsException {
        ApiResponse<JwtResponse> response = authService.login(request);
        String refreshToken = response.getData().getRefreshToken();
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/api/v1/auth")
                .maxAge((expire * 7) / 1000) // 7 ngày
                .sameSite("Lax")
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR', 'ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile(Authentication authentication) throws ResourceConflictException, ResourceNotFoundException {
        String username = authentication.getName();
        ApiResponse<UserResponse> response = authService.getMyProfile(username);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/logout")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR', 'ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<String>> logout(
            @CookieValue(value = "refreshToken", required = false) String refreshToken,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        String accessToken = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            accessToken = authHeader.substring(7);
        }

        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/api/v1/auth")
                .maxAge(0) // Xóa cookie ngay lập tức
                .sameSite("Lax")
                .build();

        ApiResponse<String> response = authService.logout(accessToken, refreshToken);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshToken(
            @CookieValue(value = "refreshToken", required = false) String refreshToken)throws InvalidCredentialsException, ResourceNotFoundException {

        ApiResponse<RefreshTokenResponse> response = authService.refreshToken(refreshToken);

        String newRefreshToken = response.getData().getRefreshToken();

        ResponseCookie cookie = ResponseCookie.from("refreshToken", newRefreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/api/v1/auth")
                .maxAge(expire * 7 / 1000) // 7 ngày
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) throws ResourceNotFoundException {
        passwordResetService.createAndSendResetToken(request);
        return ResponseEntity.ok("Hệ thống đã gửi link đặt lại mật khẩu vào Email của bạn.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) throws InvalidCredentialsException, ResourceNotFoundException {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Mật khẩu xác nhận không trùng khớp!");
        }

        passwordResetService.verifyAndResetPassword(request);
        return ResponseEntity.ok("Cập nhật mật khẩu mới thành công.");
    }
}
