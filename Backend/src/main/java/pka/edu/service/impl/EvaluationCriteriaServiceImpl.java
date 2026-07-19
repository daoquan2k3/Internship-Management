package pka.edu.service.impl;

import pka.edu.dto.request.EvaluationCriteriaCreateRequest;
import pka.edu.dto.request.EvaluationCriteriaUpdateRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.EvaluationCriteriaResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.entity.EvaluationCriteria;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.mapper.EvaluationCriteriaMapper;
import pka.edu.repository.IEvaluationCriteriaRepository;
import pka.edu.service.IEvaluationCriteriaService;
import pka.edu.util.PaginationUtil;
import pka.edu.util.ValidationErrorUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EvaluationCriteriaServiceImpl implements IEvaluationCriteriaService {
    private final IEvaluationCriteriaRepository evaluationCriteriaRepository;

    @Override
    public ApiResponse<EvaluationCriteriaResponse> createCriteria(EvaluationCriteriaCreateRequest request) throws ResourceConflictException {
        Map<String, String> errors = ValidationErrorUtil.createErrorMap();
        if (evaluationCriteriaRepository.existsByCriterionNameIgnoreCaseAndIsDeletedFalse(request.getCriterionName())) {
            errors.put("criterionName", "Evaluation criteria name already exists");
            throw new ResourceConflictException("CONFLICT", errors);
        }

        EvaluationCriteria evaluationCriteria = EvaluationCriteriaMapper.toEntity(request);

        evaluationCriteriaRepository.save(evaluationCriteria);

        return new ApiResponse<>(
                EvaluationCriteriaMapper.toDTO(evaluationCriteria),
                true,
                "Created evaluation criteria successfully",
                null,
                LocalDateTime.now()
        );
    }

    @Override
    public PageResponseDTO<EvaluationCriteriaResponse> getAllCriteria(String search, PageRequestDTO pageRequestDTO) {
        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "evaluationCriteria");

        Page<EvaluationCriteria> evaluationCriteriaPage;

        if (search != null && !search.isBlank()) {
            evaluationCriteriaPage = evaluationCriteriaRepository.findAllByKeyword(pageable, search);
        } else {
            evaluationCriteriaPage = evaluationCriteriaRepository.findAll(pageable);
        }

        return PaginationUtil.toPageResponseDTO(evaluationCriteriaPage, EvaluationCriteriaMapper::toDTO);
    }

    @Override
    public ApiResponse<EvaluationCriteriaResponse> getCriteriaById(Long id) throws ResourceNotFoundException {
        EvaluationCriteria evaluationCriteria = evaluationCriteriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation criteria not found with id: " + id));

        return new ApiResponse<>(
                EvaluationCriteriaMapper.toDTO(evaluationCriteria),
                true,
                "Get evaluation criteria successfully",
                null,
                LocalDateTime.now()
        );
    }

    @Override
    public ApiResponse<EvaluationCriteriaResponse> updateCriteria(Long id, EvaluationCriteriaUpdateRequest request) throws ResourceNotFoundException, ResourceConflictException {
        Map<String, String> errors = ValidationErrorUtil.createErrorMap();
        EvaluationCriteria existingCriteria = evaluationCriteriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation criteria not found with id: " + id));

        if (evaluationCriteriaRepository.existsByCriterionNameIgnoreCaseAndIsDeletedFalseAndCriterionIdNot(request.getCriterionName(), id)) {
            errors.put("criterionName", "Evaluation criteria name already exists");
            throw new ResourceConflictException("CONFLICT", errors);
        }

        EvaluationCriteriaMapper.updateFromDto(existingCriteria, request);
        evaluationCriteriaRepository.save(existingCriteria);
        return new ApiResponse<>(
                EvaluationCriteriaMapper.toDTO(existingCriteria),
                true,
                "Updated evaluation criteria successfully",
                null,
                LocalDateTime.now());
    }

    @Override
    public ApiResponse<String> deleteCriteria(Long id) throws ResourceNotFoundException {
        EvaluationCriteria existingCriteria = evaluationCriteriaRepository.findByCriterionIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation criteria not found with id: " + id));

        existingCriteria.setDeleted(true);
        evaluationCriteriaRepository.save(existingCriteria);
        return new ApiResponse<>("Evaluation criteria deleted successfully",
                true,
                "SUCCESS",
                null,
                LocalDateTime.now());
    }
}
