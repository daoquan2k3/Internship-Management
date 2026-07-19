package pka.edu.service;

import pka.edu.dto.request.GradeReportRequest;
import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.dto.response.ReportResponse;
import pka.edu.exception.ResourceNotFoundException;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;

public interface IReportService {
    ApiResponse<ReportResponse> processAndSaveReport(MultipartFile file, String title);

    PageResponseDTO<ReportResponse> getAllReport(String search, PageRequestDTO pageRequestDTO);

    Resource getReportFileAsResource(String storedFileName);

    ApiResponse<ReportResponse> getReportById(Long reportId) throws ResourceNotFoundException;

    PageResponseDTO<ReportResponse> getMyReport(String search, PageRequestDTO pageRequestDTO);

    ByteArrayInputStream exportReportExcel(String search, PageRequestDTO pageRequestDTO);

    ByteArrayInputStream exportReportZip(String search, PageRequestDTO pageRequestDTO);

    void gradeReport(Long reportId, GradeReportRequest request) throws ResourceNotFoundException;

    ApiResponse<ReportResponse> analyzeReportAI(Long reportId) throws Exception;
}
