package pka.edu.service;

import pka.edu.dto.request.ForgotPasswordRequest;
import pka.edu.dto.request.FormLoginRequest;
import pka.edu.dto.request.FormRegisterRequest;
import pka.edu.dto.response.*;
import pka.edu.exception.InvalidCredentialsException;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;

import javax.naming.AuthenticationException;

public interface IAuthService {
    ApiResponse<RegisterResponse> register(FormRegisterRequest request) throws ResourceConflictException, ResourceBadRequestException;
    ApiResponse<JwtResponse> login(FormLoginRequest request) throws AuthenticationException, InvalidCredentialsException, ResourceConflictException;
    ApiResponse<UserResponse> getMyProfile(String username) throws ResourceNotFoundException;
    ApiResponse<String> logout(String accessToken, String refreshToken);
    ApiResponse<RefreshTokenResponse> refreshToken(String refreshToken) throws InvalidCredentialsException, ResourceNotFoundException;
}
