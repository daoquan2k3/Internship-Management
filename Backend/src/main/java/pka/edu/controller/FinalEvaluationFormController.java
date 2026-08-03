package pka.edu.controller;

import pka.edu.dto.request.FinalEvaluationFormRequest;
import pka.edu.dto.request.UpdateJoinRequestStatusRequest;
import pka.edu.dto.request.UpdateTeacherEvaluationRequest;
import pka.edu.dto.response.FinalEvaluationFormResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.service.IFinalEvaluationFormService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import pka.edu.service.impl.FileUploadService;
import java.io.IOException;

@RestController
@RequestMapping("/api/v1/final-evaluations")
@RequiredArgsConstructor
public class FinalEvaluationFormController {

    private final IFinalEvaluationFormService formService;
    private final FileUploadService fileUploadService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<FinalEvaluationFormResponse> submitForm(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "summaryFile", required = false) MultipartFile summaryFile,
            @RequestParam("classId") Long classId,
            @RequestParam(value = "companyScore", required = false, defaultValue = "0") Double companyScore,
            @RequestParam(value = "companyFeedback", required = false, defaultValue = "") String companyFeedback,
            @RequestParam(value = "isHardCopySubmitted", required = false, defaultValue = "false") Boolean isHardCopySubmitted,
            @AuthenticationPrincipal pka.edu.security.principal.UserPrincipal userPrincipal) throws IOException, pka.edu.exception.ResourceBadRequestException {
        String fileUrl = fileUploadService.uploadGeneralFile(file, "final-evaluations");
        String summaryUrl = null;
        if (summaryFile != null && !summaryFile.isEmpty()) {
            summaryUrl = fileUploadService.uploadGeneralFile(summaryFile, "final-evaluations");
        }
        FinalEvaluationFormRequest request = new FinalEvaluationFormRequest();
        request.setClassId(classId);
        request.setScannedFormUrl(fileUrl);
        request.setSummaryReportUrl(summaryUrl);
        request.setCompanyScore(companyScore);
        request.setCompanyFeedback(companyFeedback);
        request.setIsHardCopySubmitted(isHardCopySubmitted != null ? isHardCopySubmitted : false);
        return ResponseEntity.ok(formService.submitForm(request, userPrincipal.getUsers().getUserId()));
    }

    @PutMapping("/{formId}/hard-copy")
    @PreAuthorize("hasAnyAuthority('ROLE_UNIVERSITY_REP', 'ROLE_ADMIN')")
    public ResponseEntity<FinalEvaluationFormResponse> updateHardCopyStatus(
            @PathVariable Long formId,
            @RequestParam boolean isSubmitted,
            @AuthenticationPrincipal pka.edu.security.principal.UserPrincipal userPrincipal) {
        return ResponseEntity.ok(formService.updateHardCopyStatus(formId, isSubmitted, userPrincipal.getUsers().getUserId()));
    }

    @PutMapping("/{formId}/teacher-evaluate")
    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<FinalEvaluationFormResponse> evaluateByTeacher(
            @PathVariable Long formId,
            @Valid @RequestBody UpdateTeacherEvaluationRequest request,
            @AuthenticationPrincipal pka.edu.security.principal.UserPrincipal userPrincipal) {
        return ResponseEntity.ok(formService.evaluateByTeacher(formId, request, userPrincipal.getUsers().getUserId()));
    }

    @PutMapping("/{formId}/rep-evaluate")
    @PreAuthorize("hasAnyAuthority('ROLE_UNIVERSITY_REP', 'ROLE_ADMIN')")
    public ResponseEntity<FinalEvaluationFormResponse> evaluateByUniversityRep(
            @PathVariable Long formId,
            @Valid @RequestBody UpdateJoinRequestStatusRequest request,
            @AuthenticationPrincipal pka.edu.security.principal.UserPrincipal userPrincipal) {
        return ResponseEntity.ok(formService.evaluateByUniversityRep(formId, request, userPrincipal.getUsers().getUserId()));
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyAuthority('ROLE_UNIVERSITY_REP', 'ROLE_TEACHER', 'ROLE_ADMIN')")
    public ResponseEntity<PageResponseDTO<FinalEvaluationFormResponse>> getFormsByClass(
            @PathVariable Long classId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return ResponseEntity.ok(formService.getFormsByClass(classId, pageable));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<PageResponseDTO<FinalEvaluationFormResponse>> getMyForms(
            @AuthenticationPrincipal pka.edu.security.principal.UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return ResponseEntity.ok(formService.getMyForms(userPrincipal.getUsers().getUserId(), pageable));
    }

    @GetMapping("/teacher")
    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<PageResponseDTO<FinalEvaluationFormResponse>> getFormsForTeacher(
            @AuthenticationPrincipal pka.edu.security.principal.UserPrincipal userPrincipal,
            @RequestParam(required = false) Long classId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return ResponseEntity.ok(formService.getFormsForTeacher(userPrincipal.getUsers().getUserId(), classId, pageable));
    }

    @PutMapping("/{formId}/company-score")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'ROLE_COMPANY_MENTOR', 'ROLE_COMPANY_REP', 'ROLE_ADMIN')")
    public ResponseEntity<FinalEvaluationFormResponse> updateCompanyScore(
            @PathVariable Long formId,
            @RequestParam Double companyScore,
            @RequestParam(required = false, defaultValue = "") String companyFeedback,
            @AuthenticationPrincipal pka.edu.security.principal.UserPrincipal userPrincipal) {
        return ResponseEntity.ok(formService.updateCompanyScore(formId, companyScore, companyFeedback, userPrincipal.getUsers().getUserId()));
    }

    @GetMapping("/export-excel")
    @PreAuthorize("hasAnyAuthority('ROLE_UNIVERSITY_REP', 'ROLE_TEACHER', 'ROLE_ADMIN')")
    public ResponseEntity<org.springframework.core.io.Resource> exportFinalEvaluationsToExcel(
            @AuthenticationPrincipal pka.edu.security.principal.UserPrincipal userPrincipal,
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false, defaultValue = "") String search) {

        java.io.ByteArrayInputStream in = formService.exportExcel(userPrincipal.getUsers().getUserId(), classId, search);
        org.springframework.core.io.InputStreamResource resource = new org.springframework.core.io.InputStreamResource(in);
        String fileName = "Danh_sach_Bao_cao_Cuoi_ky_" + System.currentTimeMillis() + ".xlsx";

        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(resource);
    }

    @GetMapping("/export-zip")
    @PreAuthorize("hasAnyAuthority('ROLE_UNIVERSITY_REP', 'ROLE_TEACHER', 'ROLE_ADMIN')")
    public ResponseEntity<org.springframework.core.io.Resource> exportFinalEvaluationsToZip(
            @AuthenticationPrincipal pka.edu.security.principal.UserPrincipal userPrincipal,
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false, defaultValue = "") String search) {

        java.io.ByteArrayInputStream in = formService.exportZip(userPrincipal.getUsers().getUserId(), classId, search);
        org.springframework.core.io.InputStreamResource resource = new org.springframework.core.io.InputStreamResource(in);
        String fileName = "Toan_Bo_Bao_Cao_Cuoi_ky_" + System.currentTimeMillis() + ".zip";

        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.parseMediaType("application/zip"))
                .body(resource);
    }
}
