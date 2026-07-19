package pka.edu.service.impl;

import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.request.RoundCriteriaRequest;
import pka.edu.dto.request.RoundCriterionCreateRequest;
import pka.edu.dto.request.RoundCriterionUpdateRequest;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.dto.response.RoundCriterionResponse;
import pka.edu.entity.AssessmentRound;
import pka.edu.entity.EvaluationCriteria;
import pka.edu.entity.RoundCriteria;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.mapper.RoundCriteriaMapper;
import pka.edu.repository.IAssessmentRoundsRepository;
import pka.edu.repository.IEvaluationCriteriaRepository;
import pka.edu.repository.IRoundCriteriaRepository;
import pka.edu.service.IRoundCriteriaService;
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
public class RoundCriteriaServiceImpl implements IRoundCriteriaService {
    private final IRoundCriteriaRepository roundCriteriaRepository;
    private final IAssessmentRoundsRepository iAssessmentRoundsRepository;
    private final IEvaluationCriteriaRepository iEvaluationCriteriaRepository;


    @Override
    public PageResponseDTO<RoundCriterionResponse> getAllCriteriaInRound(RoundCriteriaRequest request, PageRequestDTO pageRequestDTO) throws ResourceNotFoundException, ResourceBadRequestException {
        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "roundCriteria");
        Page<RoundCriteria> roundCriteriaPage = roundCriteriaRepository.findAllByRound_RoundId(request.getRoundId(), pageable);

        return PaginationUtil.toPageResponseDTO(roundCriteriaPage, RoundCriteriaMapper::toDto);
    }

    @Override
    public ApiResponse<RoundCriterionResponse> getCriterionInRoundById(Long roundCriteriaId) throws ResourceNotFoundException {
        RoundCriteria roundCriteria = roundCriteriaRepository.findByRoundCriteriaId(roundCriteriaId)
                .orElseThrow(() -> new ResourceNotFoundException("RoundCriteria not found with id: " + roundCriteriaId));
        return new ApiResponse<>(
                RoundCriteriaMapper.toDto(roundCriteria),
                true,
                "SUCCESS",
                null,
                null);
    }

    @Override
    public ApiResponse<RoundCriterionResponse> createCriterionInRound(RoundCriterionCreateRequest request) throws ResourceNotFoundException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        // kiem tra assessmentRound co ton tai hay khong
        AssessmentRound assessmentRound = iAssessmentRoundsRepository.findByRoundIdAndIsDeletedFalse(request.getRoundId())
                .orElseThrow(() -> new ResourceNotFoundException("AssessmentRound not found with id: " + request.getRoundId()));

        // kiem tra criteria co ton tai hay khong
        EvaluationCriteria evaluationCriteria = iEvaluationCriteriaRepository.findByCriterionIdAndIsDeletedFalse(request.getCriterionId())
                .orElseThrow(() -> new ResourceNotFoundException("EvaluationCriteria not found with id: " + request.getCriterionId()));

        if (roundCriteriaRepository.existsByCriterionAndRound(request.getRoundId(), request.getCriterionId())) {
            errorList.put("criterionId", "RoundCriteria already exists for criterion id: " + request.getCriterionId());
            throw new ResourceConflictException("Validation failed", errorList);
        }

        RoundCriteria roundCriteria = RoundCriteriaMapper.toEntity(request, assessmentRound, evaluationCriteria);

        roundCriteriaRepository.save(roundCriteria);
        return new ApiResponse<>(
                RoundCriteriaMapper.toDto(roundCriteria),
                true,
                "SUCCESS",
                null,
                LocalDateTime.now());
    }

    @Override
    public ApiResponse<RoundCriterionResponse> updateWeight(Long roundCriteriaId, RoundCriterionUpdateRequest request) throws ResourceNotFoundException {

        RoundCriteria roundCriteria = roundCriteriaRepository.findByRoundCriteriaId(roundCriteriaId)
                .orElseThrow(() -> new ResourceNotFoundException("RoundCriteria not found with id: " + roundCriteriaId));

        RoundCriteriaMapper.updateFromDto(roundCriteria, request);
        roundCriteriaRepository.save(roundCriteria);

        return new ApiResponse<>(
                RoundCriteriaMapper.toDto(roundCriteria),
                true,
                "SUCCESS",
                null,
                LocalDateTime.now());
    }

    @Override
    public ApiResponse<String> deleteCriterionInRound(Long roundCriteriaId) throws ResourceNotFoundException {
        RoundCriteria roundCriteria = roundCriteriaRepository.findByRoundCriteriaId(roundCriteriaId)
                .orElseThrow(() -> new ResourceNotFoundException("RoundCriteria not found with id: " + roundCriteriaId));

        roundCriteria.setDeleted(true);
        roundCriteriaRepository.save(roundCriteria);
        return new ApiResponse<>("RoundCriteria deleted successfully",
                true,
                "SUCCESS",
                null,
                LocalDateTime.now());
    }
}
