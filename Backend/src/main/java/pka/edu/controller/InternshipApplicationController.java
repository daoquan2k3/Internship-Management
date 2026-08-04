package pka.edu.controller;

import pka.edu.dto.request.InternshipApplicationRequest;
import pka.edu.dto.request.UpdateCompanyInfoRequest;
import pka.edu.dto.request.UpdateInternshipApplicationRequest;
import pka.edu.dto.response.InternshipApplicationResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.entity.Company;
import pka.edu.service.InternshipApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import pka.edu.service.impl.FileUploadService;
import java.io.IOException;

import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.security.principal.UserPrincipal;

@RestController
@RequestMapping("/api/v1/internship-applications")
@RequiredArgsConstructor
public class InternshipApplicationController {

    private final InternshipApplicationService applicationService;
    private final FileUploadService fileUploadService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<InternshipApplicationResponse> submitApplication(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("classId") Long classId,
            @RequestParam(value = "companyName", required = false) String companyName,
            @RequestParam(value = "taxCode", required = false) String taxCode,
            @RequestParam(value = "contactPhone", required = false) String contactPhone,
            @RequestParam(value = "position", required = false) String position,
            @RequestParam(value = "companyId", required = false) Long companyId,
            @AuthenticationPrincipal UserPrincipal userPrincipal)
            throws IOException, ResourceBadRequestException {

        String fileUrl = null;
        if (file != null && !file.isEmpty()) {
            fileUrl = fileUploadService.uploadGeneralFile(file, "applications");
        }

        InternshipApplicationRequest request = new InternshipApplicationRequest();
        request.setClassId(classId);
        request.setSoftCopyUrl(fileUrl);
        request.setCompanyName(companyName);
        request.setTaxCode(taxCode);
        request.setContactPhone(contactPhone);
        request.setPosition(position);
        request.setCompanyId(companyId);

        return ResponseEntity.ok(applicationService.submitApplication(request, userPrincipal.getUsers().getUserId()));
    }

    @PutMapping("/{applicationId}/company-info")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<InternshipApplicationResponse> updateCompanyInfo(
            @PathVariable Long applicationId,
            @Valid @RequestBody UpdateCompanyInfoRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity
                .ok(applicationService.updateCompanyInfo(applicationId, request, userPrincipal.getUsers().getUserId()));
    }

    @PutMapping("/{applicationId}/conditions")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'ROLE_UNIVERSITY_REP', 'ROLE_ADMIN')")
    public ResponseEntity<InternshipApplicationResponse> updateConditions(
            @PathVariable Long applicationId,
            @Valid @RequestBody UpdateInternshipApplicationRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity
                .ok(applicationService.updateConditions(applicationId, request, userPrincipal.getUsers().getUserId()));
    }

    @PutMapping("/{applicationId}/approve")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'ROLE_COMPANY_REP', 'ROLE_ADMIN')")
    public ResponseEntity<InternshipApplicationResponse> approveApplication(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity
                .ok(applicationService.approveApplication(applicationId, userPrincipal.getUsers().getUserId()));
    }

    @PutMapping("/{applicationId}/reject")
    @PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'ROLE_COMPANY_REP', 'ROLE_ADMIN')")
    public ResponseEntity<InternshipApplicationResponse> rejectApplication(
            @PathVariable Long applicationId,
            @Valid @RequestBody pka.edu.dto.request.RejectApplicationRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity
                .ok(applicationService.rejectApplication(applicationId, userPrincipal.getUsers().getUserId(), request));
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_UNIVERSITY_REP', 'ROLE_TEACHER')")
    public ResponseEntity<PageResponseDTO<InternshipApplicationResponse>> getApplicationsByClass(
            @PathVariable Long classId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) throws ResourceForbiddenException {
        Pageable pageable = PageRequest.of(page - 1, limit);
        return ResponseEntity.ok(applicationService.getApplicationsByClass(classId, status, pageable));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<PageResponseDTO<InternshipApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        return ResponseEntity.ok(applicationService.getMyApplications(userPrincipal.getUsers().getUserId(), pageable));
    }

    @GetMapping("/company")
    @PreAuthorize("hasAuthority('ROLE_COMPANY_REP')")
    public ResponseEntity<PageResponseDTO<InternshipApplicationResponse>> getMyCompanyApplications(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) throws ResourceForbiddenException {
        Pageable pageable = PageRequest.of(page - 1, size);
        return ResponseEntity
                .ok(applicationService.getApplicationsByCompany(userPrincipal.getUsers().getUserId(), pageable));
    }

    @GetMapping("/companies")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<java.util.List<Company>> getAllCompanies() {
        return ResponseEntity.ok(applicationService.getAllCompanies());
    }
}
