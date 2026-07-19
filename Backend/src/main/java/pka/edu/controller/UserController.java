package pka.edu.controller;

import pka.edu.dto.request.*;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.dto.response.UserResponse;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;

    @GetMapping("/profiles")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<PageResponseDTO<UserResponse>> getAllProfile(@RequestParam(required = false) String role,
            @ModelAttribute PageRequestDTO pageRequestDTO)
            throws ResourceBadRequestException, ResourceConflictException {
        return new ResponseEntity<>(userService.getAllProfile(role, pageRequestDTO), HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> createProfile(
            @Valid @RequestBody UserCreateRequest userCreateRequest)
            throws ResourceBadRequestException, ResourceConflictException {
        return new ResponseEntity<>(userService.createProfile(userCreateRequest), HttpStatus.CREATED);
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> getProfileById(@PathVariable Long userId)
            throws ResourceConflictException, ResourceNotFoundException {
        return new ResponseEntity<>(userService.getProfileById(userId), HttpStatus.OK);
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR', 'ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@PathVariable Long userId,
            @Valid @RequestBody UserUpdateRequest userUpdateRequest)
            throws ResourceConflictException, ResourceNotFoundException, ResourceForbiddenException {
        return new ResponseEntity<>(userService.updateProfile(userId, userUpdateRequest), HttpStatus.OK);
    }

    @PutMapping("/{userId}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateStatus(@PathVariable Long userId)
            throws ResourceConflictException, ResourceNotFoundException {
        return new ResponseEntity<>(userService.updateStatus(userId), HttpStatus.OK);
    }

    @PutMapping("/{userId}/role")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateRole(@PathVariable Long userId,
            @Valid @RequestBody UpdateRoleRequest request) throws ResourceConflictException, ResourceNotFoundException,
            ResourceForbiddenException, ResourceBadRequestException {
        return new ResponseEntity<>(userService.updateRole(userId, request), HttpStatus.OK);
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteProfile(@PathVariable Long userId)
            throws ResourceConflictException, ResourceNotFoundException {
        return new ResponseEntity<>(userService.deleteProfile(userId), HttpStatus.OK);
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(@Valid @RequestBody ChangePasswordRequest request)
            throws ResourceBadRequestException {
        if (!request.getConfirmPassword().equals(request.getNewPassword())) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    null,
                    false,
                    "BAD_REQUEST",
                    Map.of("confirmPassword", "Confirm password does not match new password"),
                    LocalDateTime.now()));
        }
        return ResponseEntity.ok(userService.changePassword(request));
    }

    @PutMapping("/{userId}/avatar")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR', 'ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<String>> uploadAvatar(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) throws Exception {

        if (file.isEmpty()) {
            throw new ResourceBadRequestException("File is empty", null);
        }

        return ResponseEntity.ok(userService.uploadAvatar(userId, file));
    }
}
