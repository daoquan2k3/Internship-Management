package pka.edu.service.impl;

import pka.edu.dto.request.AssessmentRoundCreateRequest;
import pka.edu.dto.request.AssessmentRoundUpdateRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.AssessmentRoundsResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.entity.AssessmentRound;
import pka.edu.entity.EvaluationCriteria;
import pka.edu.entity.InternshipPhase;
import pka.edu.entity.RoundCriteria;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.mapper.AssessmentRoundsMapper;
import pka.edu.repository.IAssessmentRoundsRepository;
import pka.edu.repository.IEvaluationCriteriaRepository;
import pka.edu.repository.InternshipPhaseRepository;
import pka.edu.service.IAssessmentRoundsService;
import pka.edu.util.PaginationUtil;
import pka.edu.util.ValidationErrorUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AssessmentRoundsServiceImpl implements IAssessmentRoundsService {

    private final IAssessmentRoundsRepository assessmentRoundsRepository;
    private final InternshipPhaseRepository internshipPhaseRepository;
    private final IEvaluationCriteriaRepository iEvaluationCriteriaRepository;


    @Override
    @Transactional(rollbackFor = Exception.class)
    public ApiResponse<AssessmentRoundsResponse> createAssessmentRound(AssessmentRoundCreateRequest request) throws ResourceNotFoundException, ResourceConflictException {
        Map<String, String> errorList = ValidationErrorUtil.createErrorMap();
        InternshipPhase phase = internshipPhaseRepository.findByPhaseIdAndIsDeletedFalse(request.getPhaseId())
                .orElseThrow(() -> new ResourceNotFoundException("Internship phase not found with id: " + request.getPhaseId()));

        AssessmentRound assessmentRounds = AssessmentRoundsMapper.toEntity(request, phase);

        Set<Long> uniqueCriterionIds = new HashSet<>();

        List<RoundCriteria> roundCriteriaList = request.getRoundCriteria().stream()
                .map(req -> {
                    EvaluationCriteria criteria = null;
                    try {
                        criteria = iEvaluationCriteriaRepository
                                .findByCriterionIdAndIsDeletedFalse(req.getCriterionId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                        "Evaluation criterion not found with id: " + req.getCriterionId()));
                    } catch (ResourceNotFoundException e) {
                        throw new RuntimeException(e);
                    }

                    if (!uniqueCriterionIds.add(req.getCriterionId())) {
                        ValidationErrorUtil.addError(errorList, "roundCriteria", "Duplicate criterion ID");
                        throw new RuntimeException(new ResourceConflictException("Validation failed", errorList));
                    }
                    return RoundCriteria.builder()
                            .round(assessmentRounds)
                            .criterion(criteria)
                            .weight(req.getWeight())
                            .build();
                })
                .toList();
        assessmentRounds.setRoundCriteriaList(roundCriteriaList);
        assessmentRoundsRepository.save(assessmentRounds);
        return new ApiResponse<>(
                AssessmentRoundsMapper.toDto(assessmentRounds),
                true,
                "Assessment round created successfully",
                null,
                LocalDateTime.now()
        );
    }

    @Override
    public PageResponseDTO<AssessmentRoundsResponse> getAllAssessmentRound(String search, Long phaseId, PageRequestDTO pageRequestDTO) {
        Pageable pageable = PaginationUtil.createPageRequest(pageRequestDTO, "assessmentRound");

        Page<AssessmentRound> assessmentRoundsPage;

        if (search != null && !search.isBlank() && phaseId != null) {
            assessmentRoundsPage = assessmentRoundsRepository.findAllByKeywordAndPhaseId(search, phaseId, pageable);
        } else if (search != null && !search.isBlank()) {
            assessmentRoundsPage = assessmentRoundsRepository.findAllByKeyword(search, pageable);
        } else if (phaseId != null && phaseId != 0) {
            assessmentRoundsPage = assessmentRoundsRepository.findAllByPhase_PhaseId(phaseId, pageable);
        } else {
            assessmentRoundsPage = assessmentRoundsRepository.findAll(pageable);
        }
        return PaginationUtil.toPageResponseDTO(assessmentRoundsPage, AssessmentRoundsMapper::toDto);
    }

    @Override
    public ApiResponse<AssessmentRoundsResponse> getAssessmentRoundById(Long id) throws ResourceNotFoundException {
        AssessmentRound assessmentRound = assessmentRoundsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment round not found with id: " + id));

        return new ApiResponse<>(AssessmentRoundsMapper.toDto(assessmentRound),
                true,
                "Get assessment round with id: " + id + " successfully",
                null,
                LocalDateTime.now());
    }

    @Override
    public ApiResponse<AssessmentRoundsResponse> updateAssessmentRound(Long id, AssessmentRoundUpdateRequest request) throws ResourceNotFoundException, ResourceConflictException, ResourceBadRequestException {
        AssessmentRound assessmentRound = assessmentRoundsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment round not found with id: " + id));

        AssessmentRoundsMapper.updateFromDto(assessmentRound, request);

        assessmentRoundsRepository.save(assessmentRound);
        return new ApiResponse<>(AssessmentRoundsMapper.toDto(assessmentRound),
                true,
                "Update assessment round successfully",
                null,
                LocalDateTime.now());
    }

    @Override
    public ApiResponse<String> deleteAssessmentRound(Long id) throws ResourceNotFoundException {
        AssessmentRound assessmentRound = assessmentRoundsRepository.findByRoundIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment round not found with id: " + id));
        assessmentRound.setDeleted(true);
        assessmentRound.setIsActive(false);
        assessmentRoundsRepository.save(assessmentRound);
        return new ApiResponse<>(
                "Assessment round with id: " + id + " has been deleted successfully",
                true,
                "SUCCESS",
                null,
                LocalDateTime.now()
        );
    }
}
