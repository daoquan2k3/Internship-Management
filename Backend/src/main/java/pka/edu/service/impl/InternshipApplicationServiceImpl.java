package pka.edu.service.impl;

import pka.edu.dto.request.InternshipApplicationRequest;
import pka.edu.dto.request.UpdateCompanyInfoRequest;
import pka.edu.dto.request.UpdateInternshipApplicationRequest;
import pka.edu.dto.response.InternshipApplicationResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.entity.Company;
import pka.edu.entity.InternshipApplication;
import pka.edu.entity.Student;
import pka.edu.entity.UniversityClass;
import pka.edu.entity.User;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.repository.StudentRepository;
import pka.edu.repository.UserRepository;
import pka.edu.repository.InternshipApplicationRepository;
import pka.edu.repository.UniversityClassRepository;
import pka.edu.repository.CompanyRepository;
import pka.edu.service.InternshipApplicationService;
import pka.edu.util.PaginationUtil;
import pka.edu.util.CurrentUserUtil;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.util.enums.JoinRequestStatus;
import pka.edu.util.enums.Role;
import pka.edu.mapper.InternshipApplicationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import pka.edu.event.NotificationEventDTO;
import pka.edu.service.IEmailService;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class InternshipApplicationServiceImpl implements InternshipApplicationService {
    private final InternshipApplicationRepository applicationRepository;
    private final UniversityClassRepository classRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final CurrentUserUtil currentUserUtil;
    private final RabbitTemplate rabbitTemplate;
    private final IEmailService emailService;
    private final pka.edu.service.IInternshipPlacementService placementService;
    private final CompanyRepository companyRepository;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.key.notification}")
    private String routingKey;

    @Override
    @Transactional
    public InternshipApplicationResponse submitApplication(InternshipApplicationRequest request, Long studentUserId) {
        Student student = studentRepository.findByUser_UserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        UniversityClass universityClass = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        if (applicationRepository
                .findByStudent_StudentIdAndUniversityClass_ClassId(student.getStudentId(), universityClass.getClassId())
                .isPresent()) {
            throw new ResourceConflictException("You have already applied to this class");
        }

        long currentApplications = applicationRepository.countByStudent_StudentIdAndStatusIn(
                student.getStudentId(), java.util.Arrays.asList(JoinRequestStatus.PENDING, JoinRequestStatus.APPROVED));
        if (currentApplications >= 2) {
            throw new ResourceConflictException("You can only apply to a maximum of 2 internship classes at a time");
        }

        Company company = null;
        String companyName = request.getCompanyName();
        String taxCode = request.getTaxCode();
        String contactPhone = request.getContactPhone();

        if (request.getCompanyId() != null) {
            company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
            companyName = company.getCompanyName();
            taxCode = company.getCompanyCode();
            contactPhone = company.getPhoneNumber();
        } else if (taxCode != null && !taxCode.trim().isEmpty()) {
            if (companyRepository.existsByCompanyCode(taxCode)) {
                throw new ResourceConflictException(
                        "Công ty này đã có trên hệ thống, vui lòng chọn từ danh sách thay vì tự điền.");
            }
        }

        InternshipApplication application = InternshipApplication.builder()
                .student(student)
                .universityClass(universityClass)
                .softCopyUrl(request.getSoftCopyUrl())
                .company(company)
                .companyName(companyName)
                .taxCode(taxCode)
                .contactPhone(contactPhone)
                .position(request.getPosition())
                .isHardCopySubmitted(false)
                .isCreditConditionMet(false)
                .status(JoinRequestStatus.PENDING)
                .build();

        InternshipApplication saved = applicationRepository.save(application);

        if (universityClass.getTeacher() != null) {
            NotificationEventDTO notification = NotificationEventDTO.builder()
                    .recipientId(universityClass.getTeacher().getUserId())
                    .title("🔔 Có đơn xin vào lớp mới!")
                    .message("Sinh viên " + student.getUser().getFullName() + " (Mã SV: " + student.getStudentCode()
                            + ") vừa nộp đơn xin gia nhập lớp " + universityClass.getClassName())
                    .type("APPLICATION_SUBMITTED")
                    .build();
            rabbitTemplate.convertAndSend(exchangeName, routingKey, notification);
        }

        if (company != null) {
            java.util.List<User> companyReps = userRepository.findByRoleAndCompany_CompanyIdAndIsDeletedFalseAndIsActiveTrue(
                    Role.ROLE_COMPANY_REP, company.getCompanyId(), org.springframework.data.domain.PageRequest.of(0, 100)).getContent();
            for (User rep : companyReps) {
                NotificationEventDTO notification = NotificationEventDTO.builder()
                        .recipientId(rep.getUserId())
                        .title("🔔 Có đơn ứng tuyển mới từ sinh viên!")
                        .message("Sinh viên " + student.getUser().getFullName() + " (Mã SV: " + student.getStudentCode()
                                + ") vừa ứng tuyển vào vị trí " + application.getPosition() + " tại doanh nghiệp của bạn.")
                        .type("APPLICATION_SUBMITTED")
                        .build();
                rabbitTemplate.convertAndSend(exchangeName, routingKey, notification);
            }
        }

        return InternshipApplicationMapper.toDto(saved);
    }

    @Override
    @Transactional
    public InternshipApplicationResponse updateCompanyInfo(Long applicationId, UpdateCompanyInfoRequest request,
            Long studentId) {
        InternshipApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        Student student = studentRepository.findByUser_UserId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        if (!application.getStudent().getStudentId().equals(student.getStudentId())) {
            throw new ResourceConflictException("You can only update your own applications");
        }

        application.setCompanyName(request.getCompanyName());
        application.setTaxCode(request.getTaxCode());
        application.setContactPhone(request.getContactPhone());
        application.setPosition(request.getPosition());

        return InternshipApplicationMapper.toDto(applicationRepository.save(application));
    }

    @Override
    @Transactional
    public InternshipApplicationResponse updateConditions(Long applicationId,
            UpdateInternshipApplicationRequest request, Long teacherId) {
        InternshipApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        checkTeacherPermission(application, teacherId);

        if (request.getIsHardCopySubmitted() != null) {
            application.setHardCopySubmitted(request.getIsHardCopySubmitted());
        }
        if (request.getIsCreditConditionMet() != null) {
            application.setCreditConditionMet(request.getIsCreditConditionMet());
        }

        return InternshipApplicationMapper.toDto(applicationRepository.save(application));
    }

    @Override
    @Transactional
    public InternshipApplicationResponse approveApplication(Long applicationId, Long teacherId) {
        InternshipApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        User user = userRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (application.getCompany() != null) {
            if (user.getRole() != Role.ROLE_COMPANY_REP && user.getRole() != Role.ROLE_ADMIN) {
                throw new ResourceConflictException(
                        "Đơn này ứng tuyển vào công ty đối tác, chỉ có Đại diện công ty mới được phép duyệt.");
            }
            if (user.getRole() == Role.ROLE_COMPANY_REP) {
                if (user.getCompany() == null
                        || !user.getCompany().getCompanyId().equals(application.getCompany().getCompanyId())) {
                    throw new ResourceConflictException("Bạn không phải là đại diện của công ty này.");
                }
            }
        } else {
            checkTeacherPermission(application, teacherId);
        }

        application.setStatus(JoinRequestStatus.APPROVED);
        InternshipApplication saved = applicationRepository.save(application);

        // Add student to class
        UniversityClass universityClass = saved.getUniversityClass();
        if (!universityClass.getStudents().contains(saved.getStudent())) {
            universityClass.getStudents().add(saved.getStudent());
            classRepository.save(universityClass);
        }

        placementService.createPlacement(saved.getApplicationId());

        if (saved.getStudent() != null && saved.getStudent().getUser() != null) {
            String subject = "Thông báo duyệt vào lớp thực tập";
            String emailBody = "<h1>Chào " + saved.getStudent().getUser().getFullName() + ",</h1>"
                    + "<p>Đơn xin vào lớp thực tập <strong>" + universityClass.getClassName()
                    + "</strong> của bạn đã được Giáo viên phụ trách chấp thuận.</p>"
                    + "<p>Chúc bạn có một kỳ thực tập thành công!</p>";

            NotificationEventDTO notification = NotificationEventDTO.builder()
                    .recipientId(saved.getStudent().getUser().getUserId())
                    .title(subject)
                    .message("Đơn xin gia nhập lớp '" + universityClass.getClassName()
                            + "' của bạn đã được Giáo viên chấp thuận!")
                    .type("APPLICATION_APPROVED")
                    .emailContent(emailBody)
                    .build();
            rabbitTemplate.convertAndSend(exchangeName, routingKey, notification);
        }

        return InternshipApplicationMapper.toDto(saved);
    }

    @Override
    @Transactional
    public InternshipApplicationResponse rejectApplication(Long applicationId, Long userId, pka.edu.dto.request.RejectApplicationRequest request) {
        InternshipApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String reason = request.getReason();

        if (application.getCompany() != null && user.getRole() == Role.ROLE_COMPANY_REP) {
            if (user.getCompany() == null || !user.getCompany().getCompanyId().equals(application.getCompany().getCompanyId())) {
                throw new ResourceConflictException("Bạn không phải là đại diện của công ty này.");
            }
            // Company Rep rejects -> Clear company info, keep status PENDING
            String oldCompanyName = application.getCompanyName();
            application.setCompany(null);
            application.setCompanyName(null);
            application.setTaxCode(null);
            application.setContactPhone(null);
            application.setPosition(null);

            if (application.getStudent() != null && application.getStudent().getUser() != null) {
                String subject = "Thông báo từ chối đơn thực tập từ doanh nghiệp";
                String emailBody = "<h1>Chào " + application.getStudent().getUser().getFullName() + ",</h1>"
                        + "<p>Đơn xin thực tập của bạn tại <strong>" + oldCompanyName + "</strong> đã bị từ chối.</p>"
                        + "<p><strong>Lý do từ chối:</strong> " + reason + "</p>"
                        + "<p>Đơn của bạn hiện tại đã trở về trạng thái 'Chưa có công ty'. Giáo viên chủ nhiệm sẽ cân nhắc duyệt hoặc sắp xếp công ty cho bạn.</p>";

                NotificationEventDTO notification = NotificationEventDTO.builder()
                        .recipientId(application.getStudent().getUser().getUserId())
                        .title(subject)
                        .message("Đơn xin thực tập tại " + oldCompanyName + " của bạn đã bị từ chối. Lý do: " + reason + ". Đơn của bạn hiện chưa có công ty.")
                        .type("APPLICATION_REJECTED")
                        .emailContent(emailBody)
                        .build();
                rabbitTemplate.convertAndSend(exchangeName, routingKey, notification);
            }
        } else {
            // Teacher / Admin / Uni Rep rejects
            checkTeacherPermission(application, userId);
            application.setStatus(JoinRequestStatus.REJECTED);

            if (application.getStudent() != null && application.getStudent().getUser() != null) {
                String subject = "Thông báo từ chối duyệt vào lớp thực tập";
                String emailBody = "<h1>Chào " + application.getStudent().getUser().getFullName() + ",</h1>"
                        + "<p>Đơn xin vào lớp thực tập <strong>" + application.getUniversityClass().getClassName()
                        + "</strong> của bạn đã bị từ chối.</p>"
                        + "<p><strong>Lý do từ chối:</strong> " + reason + "</p>"
                        + "<p>Vui lòng liên hệ với Giáo viên phụ trách hoặc Khoa để biết thêm chi tiết.</p>";

                NotificationEventDTO notification = NotificationEventDTO.builder()
                        .recipientId(application.getStudent().getUser().getUserId())
                        .title(subject)
                        .message("Đơn xin gia nhập lớp '" + application.getUniversityClass().getClassName() + "' của bạn đã bị từ chối. Lý do: " + reason)
                        .type("APPLICATION_REJECTED")
                        .emailContent(emailBody)
                        .build();
                rabbitTemplate.convertAndSend(exchangeName, routingKey, notification);
            }
        }

        return InternshipApplicationMapper.toDto(applicationRepository.save(application));
    }

    @Override
    public PageResponseDTO<InternshipApplicationResponse> getApplicationsByClass(Long classId, String status,
            Pageable pageable) throws ResourceForbiddenException {
        User currentUser = currentUserUtil.getCurrentUser();
        UniversityClass universityClass = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        if (currentUser.getRole() == Role.ROLE_TEACHER) {
            if (universityClass.getTeacher() == null
                    || !universityClass.getTeacher().getUserId().equals(currentUser.getUserId())) {
                throw new ResourceForbiddenException("Teacher can only view applications for their own classes");
            }
        } else if (currentUser.getRole() == Role.ROLE_UNIVERSITY_REP) {
            if (universityClass.getUniversity() == null || currentUser.getUniversity() == null ||
                    !universityClass.getUniversity().getUniversityId()
                            .equals(currentUser.getUniversity().getUniversityId())) {
                throw new ResourceForbiddenException(
                        "University Rep can only view applications for their university's classes");
            }
        }

        Page<InternshipApplication> page;
        if (status != null && !status.isEmpty()) {
            page = applicationRepository.findByUniversityClass_ClassIdAndStatus(
                    classId, JoinRequestStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            page = applicationRepository.findByUniversityClass_ClassId(classId, pageable);
        }
        return PaginationUtil.toPageResponseDTO(page, InternshipApplicationMapper::toDto);
    }

    @Override
    public PageResponseDTO<InternshipApplicationResponse> getMyApplications(Long studentUserId, Pageable pageable) {
        Student student = studentRepository.findByUser_UserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        Page<InternshipApplication> page = applicationRepository.findByStudent_StudentId(student.getStudentId(),
                pageable);
        return PaginationUtil.toPageResponseDTO(page, InternshipApplicationMapper::toDto);
    }

    private void checkTeacherPermission(InternshipApplication application, Long teacherId) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        if (teacher.getRole() == Role.ROLE_TEACHER) {
            if (application.getUniversityClass().getTeacher() == null ||
                    !application.getUniversityClass().getTeacher().getUserId().equals(teacherId)) {
                throw new ResourceConflictException("You are not the teacher of this class");
            }
        } else if (teacher.getRole() != Role.ROLE_UNIVERSITY_REP && teacher.getRole() != Role.ROLE_ADMIN) {
            throw new ResourceConflictException("Unauthorized to modify this application");
        }
    }

    @Override
    public PageResponseDTO<InternshipApplicationResponse> getApplicationsByCompany(Long companyRepId, Pageable pageable)
            throws ResourceForbiddenException {
        User currentUser = userRepository.findById(companyRepId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (currentUser.getRole() != Role.ROLE_COMPANY_REP || currentUser.getCompany() == null) {
            throw new ResourceForbiddenException("Only Company Representatives can view this");
        }
        Page<InternshipApplication> page = applicationRepository
                .findByCompany_CompanyId(currentUser.getCompany().getCompanyId(), pageable);
        return PaginationUtil.toPageResponseDTO(page, InternshipApplicationMapper::toDto);
    }

    @Override
    public java.util.List<pka.edu.entity.Company> getAllCompanies() {
        return companyRepository.findAll();
    }
}
