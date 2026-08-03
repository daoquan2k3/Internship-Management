package pka.edu.controller;

import pka.edu.dto.request.GradeReportRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.dto.response.ReportResponse;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.service.impl.ReportServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.net.URI;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportServiceImpl reportService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<ReportResponse>> uploadReport(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("roundId") Long roundId) {

        ApiResponse<ReportResponse> response = reportService.processAndSaveReport(file, title, roundId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR', 'ROLE_TEACHER', 'ROLE_UNIVERSITY_REP')")
    public ResponseEntity<PageResponseDTO<ReportResponse>> getAllReports(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long classId,
            PageRequestDTO pageRequestDTO) {
        return new ResponseEntity<>(reportService.getAllReport(search, classId, pageRequestDTO), HttpStatus.OK);
    }

    @GetMapping("/download/{reportId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> downloadReportFile(@PathVariable Long reportId) throws ResourceNotFoundException {
        // 1. Lấy URL từ DB
        ReportResponse report = reportService.getReportById(reportId).getData();
        String fileUrl = report.getFileUrl();

        String downloadUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(downloadUrl))
                .build();
    }

    @GetMapping("/my-reports")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<PageResponseDTO<ReportResponse>> getMyReports(@RequestParam(required = false) String search,
            PageRequestDTO pageRequestDTO) {
        return new ResponseEntity<>(reportService.getMyReport(search, pageRequestDTO), HttpStatus.OK);
    }

    @GetMapping("/export-excel")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR', 'ROLE_TEACHER', 'ROLE_UNIVERSITY_REP')")
    public ResponseEntity<Resource> exportReportsToExcel(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false) Long classId,
            PageRequestDTO pageRequestDTO) {

        ByteArrayInputStream in = reportService.exportReportExcel(search, classId, pageRequestDTO);
        InputStreamResource resource = new InputStreamResource(in);
        String fileName = "Danh_sach_Bao_cao_" + System.currentTimeMillis() + ".xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
                .contentType(
                        MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(resource);
    }

    @GetMapping("/export-zip")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR', 'ROLE_TEACHER', 'ROLE_UNIVERSITY_REP')")
    public ResponseEntity<Resource> exportReportsToZip(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(required = false) Long classId,
            PageRequestDTO pageRequestDTO) {

        ByteArrayInputStream in = reportService.exportReportZip(search, classId, pageRequestDTO);
        InputStreamResource resource = new InputStreamResource(in);

        String fileName = "Toan_Bo_Bao_Cao_" + System.currentTimeMillis() + ".zip";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.parseMediaType("application/zip"))
                .body(resource);
    }

    @PutMapping("/{reportId}/grade")
    @PreAuthorize("hasAnyAuthority('ROLE_MENTOR', 'ROLE_TEACHER')")
    public ResponseEntity<ApiResponse<Void>> gradeReport(
            @PathVariable Long reportId,
            @RequestBody GradeReportRequest request) throws ResourceNotFoundException, ResourceForbiddenException {

        reportService.gradeReport(reportId, request);

        return ResponseEntity.ok(new ApiResponse<>(
                null, true, "Chấm điểm và gửi thông báo thành công!", null, LocalDateTime.now()));
    }

    @PostMapping("/{reportId}/analyze")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR', 'ROLE_TEACHER', 'ROLE_UNIVERSITY_REP')")
    public ResponseEntity<ApiResponse<ReportResponse>> analyzeReport(
            @PathVariable Long reportId) throws Exception {

        ApiResponse<ReportResponse> response = reportService.analyzeReportAI(reportId);
        return ResponseEntity.ok(response);
    }
}