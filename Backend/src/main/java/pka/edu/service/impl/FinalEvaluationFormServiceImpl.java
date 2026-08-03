package pka.edu.service.impl;

import pka.edu.dto.request.FinalEvaluationFormRequest;
import pka.edu.dto.request.UpdateJoinRequestStatusRequest;
import pka.edu.dto.request.UpdateTeacherEvaluationRequest;
import pka.edu.dto.response.FinalEvaluationFormResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.entity.FinalEvaluationForm;
import pka.edu.entity.Student;
import pka.edu.entity.UniversityClass;
import pka.edu.entity.User;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.repository.FinalEvaluationFormRepository;
import pka.edu.repository.StudentRepository;
import pka.edu.repository.UserRepository;
import pka.edu.repository.UniversityClassRepository;
import pka.edu.repository.ReportRepository;
import pka.edu.service.IFinalEvaluationFormService;
import pka.edu.util.PaginationUtil;
import pka.edu.util.enums.JoinRequestStatus;
import pka.edu.util.enums.Role;
import pka.edu.mapper.FinalEvaluationFormMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import pka.edu.event.NotificationEventDTO;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FinalEvaluationFormServiceImpl implements IFinalEvaluationFormService {
    private final FinalEvaluationFormRepository formRepository;
    private final UniversityClassRepository classRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final ReportRepository reportRepository;
    private final org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.key.notification}")
    private String routingKey;

    @Override
    @Transactional
    public FinalEvaluationFormResponse submitForm(FinalEvaluationFormRequest request, Long studentUserId) {
        Student student = studentRepository.findByUser_UserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        UniversityClass universityClass = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        long reportCount = reportRepository.countReportsByStudentId(student.getStudentId());
        if (reportCount == 0) {
            throw new ResourceConflictException(
                    "You must submit at least one progress report before submitting the final evaluation form");
        }

        Optional<FinalEvaluationForm> existingOpt = formRepository.findByStudent_StudentIdAndUniversityClass_ClassId(
                student.getStudentId(), universityClass.getClassId());
        FinalEvaluationForm form;
        if (existingOpt.isPresent()) {
            form = existingOpt.get();
            form.setScannedFormUrl(request.getScannedFormUrl());
            form.setSummaryReportUrl(request.getSummaryReportUrl());
            form.setCompanyScore(request.getCompanyScore());
            form.setCompanyFeedback(request.getCompanyFeedback());
            if (request.getIsHardCopySubmitted() != null) {
                form.setHardCopySubmitted(request.getIsHardCopySubmitted());
            }
            form.setTeacherStatus(JoinRequestStatus.PENDING);
            form.setUniversityRepStatus(JoinRequestStatus.PENDING);
        } else {
            form = FinalEvaluationForm.builder()
                    .student(student)
                    .universityClass(universityClass)
                    .scannedFormUrl(request.getScannedFormUrl())
                    .summaryReportUrl(request.getSummaryReportUrl())
                    .isHardCopySubmitted(
                            request.getIsHardCopySubmitted() != null ? request.getIsHardCopySubmitted() : false)
                    .companyScore(request.getCompanyScore())
                    .companyFeedback(request.getCompanyFeedback())
                    .teacherStatus(JoinRequestStatus.PENDING)
                    .universityRepStatus(JoinRequestStatus.PENDING)
                    .build();
        }

        return FinalEvaluationFormMapper.toDto(formRepository.save(form));
    }

    @Override
    @Transactional
    public FinalEvaluationFormResponse updateHardCopyStatus(Long formId, boolean isHardCopySubmitted,
            Long teacherOrRepId) {
        FinalEvaluationForm form = getFormAndCheckPermission(formId, teacherOrRepId);
        form.setHardCopySubmitted(isHardCopySubmitted);
        return FinalEvaluationFormMapper.toDto(formRepository.save(form));
    }

    @Override
    @Transactional
    public FinalEvaluationFormResponse updateCompanyScore(Long formId, Double companyScore, String companyFeedback,
            Long userId) {
        FinalEvaluationForm form = getFormAndCheckPermission(formId, userId);
        form.setCompanyScore(companyScore);
        if (companyFeedback != null) {
            form.setCompanyFeedback(companyFeedback);
        }
        return FinalEvaluationFormMapper.toDto(formRepository.save(form));
    }

    @Override
    @Transactional
    public FinalEvaluationFormResponse evaluateByTeacher(Long formId, UpdateTeacherEvaluationRequest request,
            Long teacherId) {
        FinalEvaluationForm form = formRepository.findById(formId)
                .orElseThrow(() -> new ResourceNotFoundException("Form not found"));

        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        if (teacher.getRole() != Role.ROLE_ADMIN && (teacher.getRole() != Role.ROLE_TEACHER ||
                form.getUniversityClass().getTeacher() == null ||
                !form.getUniversityClass().getTeacher().getUserId().equals(teacherId))) {
            throw new ResourceConflictException("Only the assigned teacher or admin can evaluate this form");
        }

        form.setTeacherStatus(request.getStatus());
        if (request.getTeacherScore() != null) {
            form.setTeacherScore(request.getTeacherScore());
        }
        if (request.getTeacherFeedback() != null) {
            form.setTeacherFeedback(request.getTeacherFeedback());
        }
        
        FinalEvaluationForm saved = formRepository.save(form);
        
        if (saved.getStudent() != null && saved.getStudent().getUser() != null) {
            NotificationEventDTO notification = NotificationEventDTO.builder()
                    .recipientId(saved.getStudent().getUser().getUserId())
                    .title("🔔 Báo cáo cuối kỳ đã được chấm điểm!")
                    .message("Giáo viên đã chấm điểm và nhận xét báo cáo thực tập cuối kỳ của bạn.")
                    .type("EVALUATION_UPDATED")
                    .build();
            rabbitTemplate.convertAndSend(exchangeName, routingKey, notification);
        }

        return FinalEvaluationFormMapper.toDto(saved);
    }

    @Override
    @Transactional
    public FinalEvaluationFormResponse evaluateByUniversityRep(Long formId, UpdateJoinRequestStatusRequest request,
            Long repId) {
        FinalEvaluationForm form = formRepository.findById(formId)
                .orElseThrow(() -> new ResourceNotFoundException("Form not found"));

        User rep = userRepository.findById(repId)
                .orElseThrow(() -> new ResourceNotFoundException("Rep not found"));

        if (rep.getRole() != Role.ROLE_UNIVERSITY_REP && rep.getRole() != Role.ROLE_ADMIN) {
            throw new ResourceConflictException("Only university rep can evaluate this form");
        }

        form.setUniversityRepStatus(request.getStatus());
        return FinalEvaluationFormMapper.toDto(formRepository.save(form));
    }

    @Override
    public PageResponseDTO<FinalEvaluationFormResponse> getFormsByClass(Long classId, Pageable pageable) {
        Page<FinalEvaluationForm> page = formRepository.findByUniversityClass_ClassId(classId, pageable);
        return PaginationUtil.toPageResponseDTO(page, FinalEvaluationFormMapper::toDto);
    }

    @Override
    public PageResponseDTO<FinalEvaluationFormResponse> getMyForms(Long studentUserId, Pageable pageable) {
        Student student = studentRepository.findByUser_UserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        Page<FinalEvaluationForm> page = formRepository.findByStudent_StudentId(student.getStudentId(), pageable);
        return PaginationUtil.toPageResponseDTO(page, FinalEvaluationFormMapper::toDto);
    }

    @Override
    public PageResponseDTO<FinalEvaluationFormResponse> getFormsForTeacher(Long userId, Long classId,
            Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Page<FinalEvaluationForm> page;
        if (user.getRole() == Role.ROLE_ADMIN) {
            if (classId != null && classId != 0L) {
                page = formRepository.findByUniversityClass_ClassId(classId, pageable);
            } else {
                page = formRepository.findAll(pageable);
            }
        } else if (user.getRole() == Role.ROLE_UNIVERSITY_REP) {
            if (classId != null && classId != 0L) {
                page = formRepository.findByUniversityClass_ClassId(classId, pageable);
            } else if (user.getUniversity() != null) {
                page = formRepository.findByUniversityClass_University_UniversityId(
                        user.getUniversity().getUniversityId(), pageable);
            } else {
                page = Page.empty();
            }
        } else {
            page = formRepository.findByTeacherId(userId, classId, pageable);
        }
        return PaginationUtil.toPageResponseDTO(page, FinalEvaluationFormMapper::toDto);
    }

    private FinalEvaluationForm getFormAndCheckPermission(Long formId, Long userId) {
        FinalEvaluationForm form = formRepository.findById(formId)
                .orElseThrow(() -> new ResourceNotFoundException("Form not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.ROLE_STUDENT) {
            if (!form.getStudent().getUser().getUserId().equals(userId)) {
                throw new ResourceConflictException("You can only update your own form");
            }
        } else if (user.getRole() == Role.ROLE_TEACHER) {
            if (form.getUniversityClass().getTeacher() == null ||
                    !form.getUniversityClass().getTeacher().getUserId().equals(userId)) {
                throw new ResourceConflictException("You are not the teacher of this class");
            }
        } else if (user.getRole() != Role.ROLE_UNIVERSITY_REP && user.getRole() != Role.ROLE_ADMIN) {
            throw new ResourceConflictException("Unauthorized");
        }
        return form;
    }

    @Override
    public java.io.ByteArrayInputStream exportExcel(Long userId, Long classId, String search) {
        PageResponseDTO<FinalEvaluationFormResponse> pageData = this.getFormsForTeacher(userId, classId,
                org.springframework.data.domain.PageRequest.of(0, 10000));
        java.util.List<FinalEvaluationFormResponse> forms = pageData.getContent();
        if (search != null && !search.trim().isEmpty()) {
            String lowerSearch = search.trim().toLowerCase();
            forms = forms.stream()
                    .filter(f -> (f.getStudentName() != null && f.getStudentName().toLowerCase().contains(lowerSearch))
                            ||
                            (f.getStudentCode() != null && f.getStudentCode().toLowerCase().contains(lowerSearch)) ||
                            (f.getClassName() != null && f.getClassName().toLowerCase().contains(lowerSearch)))
                    .collect(java.util.stream.Collectors.toList());
        }
        return pka.edu.util.ExcelUtil.exportFinalEvaluationsToExcel(forms);
    }

    @Override
    public java.io.ByteArrayInputStream exportZip(Long userId, Long classId, String search) {
        PageResponseDTO<FinalEvaluationFormResponse> pageData = this.getFormsForTeacher(userId, classId,
                org.springframework.data.domain.PageRequest.of(0, 10000));
        java.util.List<FinalEvaluationFormResponse> forms = pageData.getContent();
        if (search != null && !search.trim().isEmpty()) {
            String lowerSearch = search.trim().toLowerCase();
            forms = forms.stream()
                    .filter(f -> (f.getStudentName() != null && f.getStudentName().toLowerCase().contains(lowerSearch))
                            ||
                            (f.getStudentCode() != null && f.getStudentCode().toLowerCase().contains(lowerSearch)) ||
                            (f.getClassName() != null && f.getClassName().toLowerCase().contains(lowerSearch)))
                    .collect(java.util.stream.Collectors.toList());
        }

        java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();

        try (java.util.zip.ZipOutputStream zos = new java.util.zip.ZipOutputStream(baos)) {
            for (FinalEvaluationFormResponse form : forms) {
                String studentCodeStr = form.getStudentCode() != null ? form.getStudentCode()
                        : String.valueOf(form.getStudentId() != null ? form.getStudentId() : "SV");
                if (form.getScannedFormUrl() != null && !form.getScannedFormUrl().isEmpty()) {
                    try {
                        byte[] fileBytes = restTemplate.getForObject(form.getScannedFormUrl(), byte[].class);
                        if (fileBytes != null) {
                            String ext = "";
                            if (form.getScannedFormUrl().contains(".")) {
                                String[] parts = form.getScannedFormUrl().split("\\.");
                                ext = "." + parts[parts.length - 1].split("\\?")[0];
                            } else {
                                ext = ".pdf";
                            }
                            String entryName = studentCodeStr + "_Don_Danh_Gia_"
                                    + (form.getId() != null ? form.getId() : 0) + ext;
                            java.util.zip.ZipEntry zipEntry = new java.util.zip.ZipEntry(entryName);
                            zos.putNextEntry(zipEntry);
                            zos.write(fileBytes);
                            zos.closeEntry();
                        }
                    } catch (Exception e) {
                        System.err.println("Unable to compress scanned form: " + form.getScannedFormUrl() + " - "
                                + e.getMessage());
                    }
                }
                if (form.getSummaryReportUrl() != null && !form.getSummaryReportUrl().isEmpty()) {
                    try {
                        byte[] fileBytes = restTemplate.getForObject(form.getSummaryReportUrl(), byte[].class);
                        if (fileBytes != null) {
                            String ext = "";
                            if (form.getSummaryReportUrl().contains(".")) {
                                String[] parts = form.getSummaryReportUrl().split("\\.");
                                ext = "." + parts[parts.length - 1].split("\\?")[0];
                            } else {
                                ext = ".pdf";
                            }
                            String entryName = studentCodeStr + "_Bao_Cao_Tong_Hop_"
                                    + (form.getId() != null ? form.getId() : 0) + ext;
                            java.util.zip.ZipEntry zipEntry = new java.util.zip.ZipEntry(entryName);
                            zos.putNextEntry(zipEntry);
                            zos.write(fileBytes);
                            zos.closeEntry();
                        }
                    } catch (Exception e) {
                        System.err.println("Unable to compress summary report: " + form.getSummaryReportUrl() + " - "
                                + e.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error compressing ZIP file: " + e.getMessage());
        }

        return new java.io.ByteArrayInputStream(baos.toByteArray());
    }
}
