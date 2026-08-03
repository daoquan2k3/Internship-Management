package pka.edu.service.impl;

import pka.edu.dto.request.InternshipPhaseCreateRequest;
import pka.edu.dto.request.InternshipPhaseUpdateRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.InternshipPhaseResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.entity.InternshipPhase;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.mapper.InternshipPhaseMapper;
import pka.edu.repository.InternshipPhaseRepository;
import pka.edu.service.InternshipPhaseService;
import pka.edu.util.PaginationUtil;
import pka.edu.util.ValidationErrorUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InternshipPhaseServiceImpl implements InternshipPhaseService {
    private final InternshipPhaseRepository internshipPhaseRepository;


    @Override
    public ApiResponse<InternshipPhaseResponse> createInternshipPhase(InternshipPhaseCreateRequest request) throws ResourceConflictException {
        Map<String, String> errors = ValidationErrorUtil.createErrorMap();
        if (internshipPhaseRepository.existsByPhaseNameIgnoreCaseAndIsDeletedFalse(request.getPhaseName())) {
            ValidationErrorUtil.addError(errors, "phaseName", "Internship phase name already exists");
            throw new ResourceConflictException("CONFLICT", errors);
        }

        InternshipPhase internshipPhase = InternshipPhaseMapper.toEntity(request);
        internshipPhaseRepository.save(internshipPhase);

        return new ApiResponse<>(
                InternshipPhaseMapper.toDto(internshipPhase),
                true,
                "Create internship phase successfully",
                null,
                LocalDateTime.now()
        );
    }

    @Cacheable("internshipPhases")
    @Override
    public PageResponseDTO<InternshipPhaseResponse> getAllInternshipPhase(String search, PageRequestDTO pageRequestDTO) {
        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "internshipPhase");
        Page<InternshipPhase> internshipPhasePage;

        if (search != null && !search.isBlank()) {
            internshipPhasePage = internshipPhaseRepository.findAllByKeyword(pageable, search);
        } else {
            internshipPhasePage = internshipPhaseRepository.findAll(pageable);
        }
        return PaginationUtil.toPageResponseDTO(internshipPhasePage, InternshipPhaseMapper::toDto);
    }

    @Override
    public ApiResponse<InternshipPhaseResponse> getInternshipPhaseById(Long id) throws ResourceNotFoundException {
        InternshipPhase internshipPhase = internshipPhaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship phase not found with id: " + id));

        return new ApiResponse<>(InternshipPhaseMapper.toDto(internshipPhase), true, "SUCCESS", null, LocalDateTime.now());
    }

    @Override
    public ApiResponse<InternshipPhaseResponse> updateInternshipPhase(Long id, InternshipPhaseUpdateRequest request) throws ResourceNotFoundException, ResourceConflictException, ResourceBadRequestException {
        Map<String, String> errors = ValidationErrorUtil.createErrorMap();
        InternshipPhase existingPhase = internshipPhaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship phase not found with id: " + id));

        if (internshipPhaseRepository.existsByPhaseNameIgnoreCaseAndIsDeletedFalseAndPhaseIdNot(request.getPhaseName(), id)) {
            ValidationErrorUtil.addError(errors, "phaseName", "Internship phase name already exists");
            throw new ResourceConflictException("CONFLICT", errors);
        }

        InternshipPhaseMapper.updateFromDto(existingPhase, request);
        internshipPhaseRepository.save(existingPhase);
        return new ApiResponse<>(
                InternshipPhaseMapper.toDto(existingPhase),
                true,
                "SUCCESS",
                null,
                LocalDateTime.now());
    }

    @Override
    public ApiResponse<String> deleteInternshipPhase(Long id) throws ResourceNotFoundException {
        InternshipPhase existingPhase = internshipPhaseRepository.findByPhaseIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship phase not found with id: " + id));
        existingPhase.setDeleted(true);
        internshipPhaseRepository.save(existingPhase);
        return new ApiResponse<>("Internship phase deleted successfully",
                true,
                "SUCCESS",
                null,
                LocalDateTime.now());
    }

}
