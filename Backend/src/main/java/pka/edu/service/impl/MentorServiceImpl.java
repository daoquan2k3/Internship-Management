package pka.edu.service.impl;

import pka.edu.dto.request.MentorCreateRequest;
import pka.edu.dto.request.MentorUpdateRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.MentorResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.entity.Mentor;
import pka.edu.entity.User;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.mapper.MentorMapper;
import pka.edu.repository.IMentorRepository;
import pka.edu.repository.IUserRepository;
import pka.edu.service.IMentorService;
import pka.edu.util.CurrentUserUtil;
import pka.edu.util.PaginationUtil;
import pka.edu.util.ValidationErrorUtil;
import pka.edu.util.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MentorServiceImpl implements IMentorService {
    private final IMentorRepository mentorRepository;
    private final IUserRepository iUserRepository;
    private final CurrentUserUtil currentUserUtil;

    @Override
    public PageResponseDTO<Object> getAllMentor(PageRequestDTO pageRequestDTO) throws ResourceNotFoundException, ResourceForbiddenException {
        User user = currentUserUtil.getCurrentUser();

        Page<Mentor> mentorPage;
        if (user.getRole() == Role.ROLE_ADMIN) {
            Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "mentor");
            mentorPage = mentorRepository.findAllByMentor(pageable);
            return PaginationUtil.toPageResponseDTO(mentorPage, MentorMapper::toDto);
        } else if (user.getRole() == Role.ROLE_STUDENT) {
            Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "mentor");
            mentorPage = mentorRepository.findAllByMentor(pageable);
            return PaginationUtil.toPageResponseDTO(mentorPage, MentorMapper::toPublicDto);
        } else {
            throw new ResourceForbiddenException("User role not supported for this operation");
        }
    }

    @Override
    public ApiResponse<Object> getMentorById(Long id) throws ResourceNotFoundException, ResourceForbiddenException {
        User user = currentUserUtil.getCurrentUser();

        if (user.getRole() == Role.ROLE_ADMIN) {
            Mentor mentor = mentorRepository.findByMentorId(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Mentor not found with id: " + id));

            return new ApiResponse<>(MentorMapper.toDto(mentor), true, "SUCCESS", null, null);
        } else if (user.getRole() == Role.ROLE_STUDENT) {
            Mentor mentor = mentorRepository.findByMentorId(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Mentor not found with id: " + id));

            return new ApiResponse<>(MentorMapper.toPublicDto(mentor), true, "SUCCESS", null, null);
        } else if (user.getRole() == Role.ROLE_MENTOR) {
            Mentor mentor = mentorRepository.findByMentorId(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Mentor not found with id: " + id));
            if (!mentor.getUser().getUserId().equals(user.getUserId())) {
                throw new ResourceForbiddenException("You cannot view other mentor's information");
            }
            return new ApiResponse<>(MentorMapper.toDto(mentor), true, "SUCCESS", null, null);
        } else {
            throw new ResourceForbiddenException("User role not supported for this operation");
        }
    }

    @Override
    public ApiResponse<MentorResponse> createMentor(MentorCreateRequest request) throws ResourceNotFoundException, ResourceForbiddenException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();

        User user = iUserRepository.findByUserIdAndIsDeletedFalseAndIsActiveTrue(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        if (user.getRole() != Role.ROLE_MENTOR) {
            throw new ResourceForbiddenException("User with id: " + request.getUserId() + " does not have the MENTOR role");
        }

        if (mentorRepository.existsById(request.getUserId())) {
            errorList.put("userId", "Mentor with this user ID already exists");
            throw new ResourceConflictException("Validation failed", errorList);
        }

        Mentor mentor = MentorMapper.toEntity(request);
        mentor.setUser(user);

        mentor = mentorRepository.save(mentor);
        return new ApiResponse<>(
                MentorMapper.toDto(mentor),
                true,
                "SUCCESS",
                null,
                LocalDateTime.now());
    }

    @Override
    public ApiResponse<MentorResponse> updateMentor(Long id, MentorUpdateRequest request) throws ResourceNotFoundException, ResourceForbiddenException, ResourceBadRequestException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        User currentUser = currentUserUtil.getCurrentUser();

        if (currentUser.getRole() == Role.ROLE_ADMIN) {
            Mentor existingMentor = mentorRepository.findByMentorId(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Mentor not found with id: " + id));

            if (iUserRepository.existsByEmailAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(request.getEmail(), existingMentor.getUser().getUserId())) {
                errorList.put("email", "Email already exists");
                throw new ResourceConflictException("Validation failed", errorList);
            }

            MentorMapper.updateFromDto(existingMentor, request);
            existingMentor = mentorRepository.save(existingMentor);
            return new ApiResponse<>(
                    MentorMapper.toDto(existingMentor),
                    true,
                    "Mentor updated successfully",
                    null,
                    LocalDateTime.now());
        } else if (currentUser.getRole() == Role.ROLE_MENTOR) {
            Mentor existingMentor = mentorRepository.findByMentorId(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Mentor not found with id: " + id));

            if (!existingMentor.getUser().getUserId().equals(currentUser.getUserId())) {
                throw new ResourceForbiddenException("You cannot update other mentor's information");
            }

            if (iUserRepository.existsByEmailAndIsDeletedFalseAndIsActiveTrueAndUserIdNot(request.getEmail(), existingMentor.getUser().getUserId())) {
                errorList.put("email", "Email already exists");
                throw new ResourceConflictException("Validation failed", errorList);
            }

            MentorMapper.updateFromDto(existingMentor, request);
            existingMentor = mentorRepository.save(existingMentor);
            return new ApiResponse<>(
                    MentorMapper.toDto(existingMentor),
                    true,
                    "Mentor updated successfully",
                    null,
                    LocalDateTime.now());
        } else {
            throw new ResourceForbiddenException("User role not supported for this operation");
        }
    }

    @Override
    public ApiResponse<MentorResponse> getMentorInfo(String username) throws ResourceNotFoundException {
        Mentor mentor = mentorRepository.findByUser_Username(username)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found with username: " + username));
        return new ApiResponse<>(
                MentorMapper.toDto(mentor),
                true,
                "SUCCESS",
                null,
                LocalDateTime.now());
    }


}
