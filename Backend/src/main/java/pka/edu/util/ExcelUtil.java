package pka.edu.util;

import pka.edu.dto.response.ReportResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

public class ExcelUtil {

    public static ByteArrayInputStream exportReportsToExcel(List<ReportResponse> reports) {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Danh sách Báo cáo");

            String[] headers = {"ID", "Tiêu đề", "Tên sinh viên", "Mã sinh viên", "Ngày nộp", "Tên File Gốc"};
            Row headerRow = sheet.createRow(0);

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIndex = 1;
            for (ReportResponse report : reports) {
                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(report.getReportId());
                row.createCell(1).setCellValue(report.getTitle());
                row.createCell(2).setCellValue(report.getStudentName());
                row.createCell(3).setCellValue(report.getStudentCode());
                row.createCell(4).setCellValue(report.getUploadTime() != null ? report.getUploadTime().toString() : "");
                row.createCell(5).setCellValue(report.getOriginalFileName());
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi xuất file Excel: " + e.getMessage());
        }
    }

    public static ByteArrayInputStream exportFinalEvaluationsToExcel(List<pka.edu.dto.response.FinalEvaluationFormResponse> forms) {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Báo cáo cuối kỳ");

            String[] headers = {"ID", "Mã SV", "Tên sinh viên", "Lớp", "Điểm Doanh nghiệp", "Nhận xét Doanh nghiệp", "Bản cứng", "Trạng thái Đại diện", "Trạng thái Giảng viên"};
            Row headerRow = sheet.createRow(0);

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIndex = 1;
            for (pka.edu.dto.response.FinalEvaluationFormResponse form : forms) {
                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(form.getId() != null ? form.getId() : 0);
                row.createCell(1).setCellValue(form.getStudentCode() != null ? form.getStudentCode() : String.valueOf(form.getStudentId() != null ? form.getStudentId() : ""));
                row.createCell(2).setCellValue(form.getStudentName() != null ? form.getStudentName() : "");
                row.createCell(3).setCellValue(form.getClassName() != null ? form.getClassName() : "");
                row.createCell(4).setCellValue(form.getCompanyScore() != null ? String.valueOf(form.getCompanyScore()) : "N/A");
                row.createCell(5).setCellValue(form.getCompanyFeedback() != null ? form.getCompanyFeedback() : "");
                row.createCell(6).setCellValue(form.isHardCopySubmitted() ? "Đã thu" : "Chưa thu");
                row.createCell(7).setCellValue(form.getUniversityRepStatus() != null ? form.getUniversityRepStatus().name() : "");
                row.createCell(8).setCellValue(form.getTeacherStatus() != null ? form.getTeacherStatus().name() : "");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi xuất file Excel: " + e.getMessage());
        }
    }
}