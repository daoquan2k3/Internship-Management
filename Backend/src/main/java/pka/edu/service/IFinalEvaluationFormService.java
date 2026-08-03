package pka.edu.service;

import pka.edu.dto.request.FinalEvaluationFormRequest;
import pka.edu.dto.request.UpdateJoinRequestStatusRequest;
import pka.edu.dto.request.UpdateTeacherEvaluationRequest;
import pka.edu.dto.response.FinalEvaluationFormResponse;
import pka.edu.dto.response.PageResponseDTO;
import org.springframework.data.domain.Pageable;

public interface IFinalEvaluationFormService {
    FinalEvaluationFormResponse submitForm(FinalEvaluationFormRequest request, Long studentId);
    FinalEvaluationFormResponse updateHardCopyStatus(Long formId, boolean isHardCopySubmitted, Long teacherOrRepId);
    FinalEvaluationFormResponse evaluateByTeacher(Long formId, UpdateTeacherEvaluationRequest request, Long teacherId);
    FinalEvaluationFormResponse evaluateByUniversityRep(Long formId, UpdateJoinRequestStatusRequest request, Long repId);
    FinalEvaluationFormResponse updateCompanyScore(Long formId, Double companyScore, String companyFeedback, Long userId);
    PageResponseDTO<FinalEvaluationFormResponse> getFormsByClass(Long classId, Pageable pageable);
    PageResponseDTO<FinalEvaluationFormResponse> getMyForms(Long studentUserId, Pageable pageable);
    PageResponseDTO<FinalEvaluationFormResponse> getFormsForTeacher(Long teacherId, Long classId, Pageable pageable);
    java.io.ByteArrayInputStream exportExcel(Long userId, Long classId, String search);
    java.io.ByteArrayInputStream exportZip(Long userId, Long classId, String search);
}
