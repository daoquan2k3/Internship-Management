package pka.edu.service.impl;

import pka.edu.dto.request.ForgotPasswordRequest;
import pka.edu.dto.request.ResetPasswordRequest;
import pka.edu.entity.User;
import pka.edu.exception.InvalidCredentialsException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final RedisTemplate<String, String> redisTemplate;
    private final PasswordEncoder passwordEncoder;
    private final IUserRepository userRepository;

    private static final String REDIS_PREFIX = "forgot_password_token:";
    private final EmailService emailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public void createAndSendResetToken(ForgotPasswordRequest request) throws ResourceNotFoundException {
        User user = userRepository.findByEmailAndIsDeletedFalseAndIsActiveTrue(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        String token = UUID.randomUUID().toString();
        redisTemplate.opsForValue().set(REDIS_PREFIX + token, request.getEmail(), Duration.ofHours(1));

        String resetUrl = frontendUrl + "/#/reset-password?token=" + token;

        emailService.sendResetPasswordEmail(request.getEmail(), user.getUsername(), resetUrl);
    }

    public void verifyAndResetPassword(ResetPasswordRequest request) throws InvalidCredentialsException, ResourceNotFoundException {
        String redisKey = REDIS_PREFIX + request.getToken();
        String email = redisTemplate.opsForValue().get(redisKey);

        if (email == null){
            throw new InvalidCredentialsException("Invalid or expired token");
        }

        User user = userRepository.findByEmailAndIsDeletedFalseAndIsActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        redisTemplate.delete(redisKey);
    }
}
