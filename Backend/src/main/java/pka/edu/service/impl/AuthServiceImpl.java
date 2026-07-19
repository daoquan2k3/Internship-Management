package pka.edu.service.impl;

import pka.edu.dto.request.ForgotPasswordRequest;
import pka.edu.dto.request.FormLoginRequest;
import pka.edu.dto.request.FormRegisterRequest;
import pka.edu.dto.response.*;
import pka.edu.entity.Mentor;
import pka.edu.entity.Student;
import pka.edu.entity.User;
import pka.edu.exception.InvalidCredentialsException;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.mapper.UserMapper;
import pka.edu.repository.IMentorRepository;
import pka.edu.repository.IStudentRepository;
import pka.edu.repository.IUserRepository;
import pka.edu.security.jwt.JwtProvider;
import pka.edu.security.jwt.RefreshTokenService;
import pka.edu.security.jwt.TokenBlacklistService;
import pka.edu.security.principal.UserPrincipal;
import pka.edu.service.IAuthService;
import pka.edu.util.ValidationErrorUtil;
import pka.edu.util.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {
    private final IUserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenBlacklistService tokenBlacklistService;
    private final RefreshTokenService refreshTokenService;
    private final IStudentRepository iStudentRepository;
    private final IMentorRepository iMentorRepository;

    @Value("${jwt_expire}")
    private long expire;

    @Override
    @Transactional
    public ApiResponse<RegisterResponse> register(FormRegisterRequest request) throws ResourceBadRequestException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();

        if (userRepository.existsByUsernameAndIsDeletedFalseAndIsActiveTrue(request.getUsername())) {
            errorList.put("username", "Username already exists");
        }

        if (userRepository.existsByEmailAndIsDeletedFalseAndIsActiveTrue(request.getEmail())) {
            errorList.put("email", "Email already exists");
        }
        if (ValidationErrorUtil.hasErrors(errorList)) {
            throw new ResourceConflictException("Validation failed", errorList);
        }

        User users = new User();

        if (request.getRole() != null) {
            try {
                users.setRole(Role.valueOf(request.getRole().toUpperCase()));
            }catch (IllegalArgumentException e) {
                errorList.put("role", "Invalid role value");
                throw new ResourceBadRequestException("Validation failed", errorList);
            }
        }else {
            users.setRole(Role.ROLE_STUDENT);
        }

        users.setUsername(request.getUsername());
        users.setPassword(passwordEncoder.encode(request.getPassword()));
        users.setFullName(request.getFullName());
        users.setEmail(request.getEmail());
        users.setPhoneNumber(request.getPhoneNumber());
        userRepository.save(users);

        if (users.getRole() == Role.ROLE_STUDENT) {
            Student student = new Student();
            student.setUser(users);
            student.setStudentCode("STU" + String.format("%04d", users.getUserId()));
            iStudentRepository.save(student);
        }else if (users.getRole() == Role.ROLE_MENTOR) {
            Mentor mentor = new Mentor();
            mentor.setUser(users);
            iMentorRepository.save(mentor);
        }
        RegisterResponse response = RegisterResponse.builder()
                .message("Register successfully")
                .user(UserMapper.toDto(users))
                .build();

        return new ApiResponse<>(response, true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    public ApiResponse<JwtResponse> login(FormLoginRequest request) throws InvalidCredentialsException {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User users = userPrincipal.getUsers();

            Date expireDate = new Date(new Date().getTime() + expire);

            String accessToken = jwtProvider.generateAccessToken(users);

            String refreshToken = jwtProvider.generateRefreshToken(users);

            refreshTokenService.saveRefreshToken(refreshToken);

            JwtResponse response = JwtResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .expiresIn(expireDate)
                    .username(request.getUsername())
                    .user(UserMapper.toDto(users))
                    .build();
            return new ApiResponse<>(response, true, "SUCCESS", null, LocalDateTime.now());
        }catch (AuthenticationException ex) {
            throw new InvalidCredentialsException("Invalid username or password");
        }
    }

    @Override
    public ApiResponse<UserResponse> getMyProfile(String username) throws ResourceNotFoundException {
        User users = userRepository.findByUsernameAndIsDeletedFalseAndIsActiveTrue(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return new ApiResponse<>(UserMapper.toDto(users), true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    public ApiResponse<String> logout(String accessToken, String refreshToken) {
        // Them accessToken vao blacklist
        tokenBlacklistService.addTokenToBlacklist(accessToken, "access");

        refreshTokenService.deleteRefreshToken(refreshToken);

        return new ApiResponse<>(
                "Logout successfully",
                true,
                "SUCCESS",
                null,
                LocalDateTime.now()
        );
    }

    @Override
    public ApiResponse<RefreshTokenResponse> refreshToken(String refreshToken) throws InvalidCredentialsException, ResourceNotFoundException {
        if (!refreshTokenService.isRefreshTokenValid(refreshToken)) {
            throw new InvalidCredentialsException("Invalid refresh token or expired");
        }

        String username = jwtProvider.getUsernameFromToken(refreshToken);
        User users = userRepository.findByUsernameAndIsDeletedFalseAndIsActiveTrue(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        // Tao moi 1 accessToken va refreshToken moi
        String accessTokenNew = jwtProvider.generateAccessToken(users);
        String refreshTokenNew = jwtProvider.generateRefreshToken(users);
        refreshTokenService.saveRefreshToken(refreshTokenNew);
        refreshTokenService.deleteRefreshToken(refreshToken);
        RefreshTokenResponse response = RefreshTokenResponse.builder()
                .accessToken(accessTokenNew)
                .refreshToken(refreshTokenNew)
                .expiresIn(new Date(new Date().getTime() + expire))
                .build();

        return new ApiResponse<>(
                response,
                true,
                "SUCCESS",
                null,
                LocalDateTime.now()
        );
    }

    @Override
    public ApiResponse<String> forgotPassword(ForgotPasswordRequest request) {
        return null;
    }
}
