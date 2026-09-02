package pka.edu.service.impl;

import pka.edu.dto.request.UniversityJoinRequestRequest;
import pka.edu.dto.request.UpdateJoinRequestStatusRequest;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.dto.response.UniversityJoinRequestResponse;
import pka.edu.entity.Student;
import pka.edu.entity.University;
import pka.edu.entity.UniversityJoinRequest;
import pka.edu.entity.User;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.mapper.UniversityJoinRequestMapper;
import pka.edu.repository.StudentRepository;
import pka.edu.repository.UserRepository;
import pka.edu.repository.UniversityJoinRequestRepository;
import pka.edu.repository.UniversityRepository;
import pka.edu.service.IEmailService;
import pka.edu.service.IUniversityJoinRequestService;
import pka.edu.util.PaginationUtil;
import pka.edu.util.enums.JoinRequestStatus;
import pka.edu.util.enums.Role;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.util.CurrentUserUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import pka.edu.event.NotificationEventDTO;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UniversityJoinRequestServiceImpl implements IUniversityJoinRequestService {
    private final UniversityJoinRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final UniversityRepository universityRepository;
    private final IEmailService emailService;
    private final CurrentUserUtil currentUserUtil;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.key.notification}")
    private String routingKey;

    @Override
    @Transactional
    public UniversityJoinRequestResponse createRequest(UniversityJoinRequestRequest request, Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (student.getRole() != Role.ROLE_STUDENT) {
            throw new ResourceConflictException("Only students can create a join request");
        }

        University university = universityRepository.findById(request.getUniversityId())
                .orElseThrow(() -> new ResourceNotFoundException("University not found"));

        boolean pendingExists = requestRepository.existsByUser_UserIdAndStatus(
                studentId, JoinRequestStatus.PENDING);
        if (pendingExists) {
            throw new ResourceConflictException("You already have a pending join request. Please wait for it to be processed.");
        }

        String reqStudentId = request.getUniversityStudentId();
        Student studentProfile = student.getStudent();
        
        if (studentProfile != null && !reqStudentId.equals(studentProfile.getStudentCode())) {
            if (studentRepository.existsByStudentCode(reqStudentId)) {
                throw new ResourceConflictException("This University Student ID is already used by another account.");
            }
        }
        
        if (requestRepository.existsByUniversityStudentIdAndStatusAndUser_UserIdNot(reqStudentId, JoinRequestStatus.PENDING, studentId) ||
            requestRepository.existsByUniversityStudentIdAndStatusAndUser_UserIdNot(reqStudentId, JoinRequestStatus.APPROVED, studentId)) {
            throw new ResourceConflictException("This University Student ID is already taken by another request.");
        }

        UniversityJoinRequest joinRequest = UniversityJoinRequest.builder()
                .user(student)
                .university(university)
                .universityStudentId(request.getUniversityStudentId())
                .status(JoinRequestStatus.PENDING)
                .notes(request.getNotes())
                .build();

        UniversityJoinRequest saved = requestRepository.save(joinRequest);

        List<User> reps = userRepository.findAllByRoleAndUniversity_UniversityIdAndIsDeletedFalseAndIsActiveTrue(
                Role.ROLE_UNIVERSITY_REP, university.getUniversityId());
        for (User rep : reps) {
            NotificationEventDTO notification = NotificationEventDTO.builder()
                    .recipientId(rep.getUserId())
                    .title("🔔 Có yêu cầu gia nhập trường mới!")
                    .message("Sinh viên " + student.getFullName() + " (Mã SV: " + request.getUniversityStudentId() + ") vừa gửi yêu cầu gia nhập trường " + university.getUniversityName())
                    .type("UNIVERSITY_JOIN_REQUEST")
                    .build();
            rabbitTemplate.convertAndSend(exchangeName, routingKey, notification);
        }

        return UniversityJoinRequestMapper.toDto(saved);
    }

    @Override
    @Transactional
    public UniversityJoinRequestResponse updateStatus(Long requestId, UpdateJoinRequestStatusRequest request,
            Long universityRepId) {
        UniversityJoinRequest joinRequest = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Join request not found"));

        User rep = userRepository.findById(universityRepId)
                .orElseThrow(() -> new ResourceNotFoundException("University rep not found"));

        if (rep.getRole() != Role.ROLE_UNIVERSITY_REP && rep.getRole() != Role.ROLE_ADMIN) {
            throw new ResourceConflictException("Unauthorized role for updating join request");
        }

        // Ensure the rep belongs to the same university
        if (rep.getUniversity() == null
                || !rep.getUniversity().getUniversityId().equals(joinRequest.getUniversity().getUniversityId())) {
            throw new ResourceConflictException("You don't have permission to update requests for this university");
        }

        joinRequest.setStatus(request.getStatus());
        UniversityJoinRequest saved = requestRepository.save(joinRequest);

        if (request.getStatus() == JoinRequestStatus.APPROVED) {
            User student = saved.getUser();
            student.setUniversity(saved.getUniversity());
            
            Student studentProfile = student.getStudent();
            if (studentProfile != null) {
                studentProfile.setStudentCode(saved.getUniversityStudentId());
                studentRepository.save(studentProfile);
            }
            userRepository.save(student);

            String subject = "Hướng dẫn làm đơn xin vào lớp thực tập";
            String emailBody = "<h1>Chào " + student.getFullName() + ",</h1>"
                    + "<p>Yêu cầu tham gia trường của bạn đã được duyệt.</p>"
                    + "<p>Vui lòng làm theo hướng dẫn sau để nộp đơn vào lớp thực tập:</p>"
                    + "<ul>"
                    + "<li>Bước 1: Tải mẫu đơn tại trang chủ hệ thống.</li>"
                    + "<li>Bước 2: Điền đầy đủ thông tin vào mẫu đơn và có chữ ký xác nhận.</li>"
                    + "<li>Bước 3: Nộp bản mềm (ảnh chụp/scan) lên hệ thống (phần Nộp đơn).</li>"
                    + "<li>Bước 4: Nộp bản cứng tại văn phòng khoa.</li>"
                    + "</ul>"
                    + "<p>Chúc bạn có một kỳ thực tập thành công!</p>";

            NotificationEventDTO notification = NotificationEventDTO.builder()
                    .recipientId(student.getUserId())
                    .title(subject)
                    .message("Yêu cầu tham gia trường " + saved.getUniversity().getUniversityName() + " của bạn đã được chấp thuận. Vui lòng nộp đơn vào lớp thực tập!")
                    .type("UNIVERSITY_JOIN_APPROVED")
                    .emailContent(emailBody)
                    .build();
            rabbitTemplate.convertAndSend(exchangeName, routingKey, notification);
        }

        return UniversityJoinRequestMapper.toDto(saved);
    }

    @Override
    public PageResponseDTO<UniversityJoinRequestResponse> getRequestsByUniversity(Long universityId, String status,
            Pageable pageable) throws ResourceForbiddenException {
        User currentUser = currentUserUtil.getCurrentUser();
        if (currentUser.getRole() == Role.ROLE_UNIVERSITY_REP) {
            if (currentUser.getUniversity() == null || !currentUser.getUniversity().getUniversityId().equals(universityId)) {
                throw new ResourceForbiddenException("University Rep can only view join requests for their own university");
            }
        }
        Page<UniversityJoinRequest> page;
        if (status != null && !status.isEmpty()) {
            page = requestRepository.findByUniversity_UniversityIdAndStatus(
                    universityId, JoinRequestStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            page = requestRepository.findByUniversity_UniversityId(universityId, pageable);
        }
        return PaginationUtil.toPageResponseDTO(page, UniversityJoinRequestMapper::toDto);
    }


    @Override
    public PageResponseDTO<UniversityJoinRequestResponse> getMyRequests(Long studentUserId, Pageable pageable) {
        Student student = studentRepository.findByUser_UserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        Page<UniversityJoinRequest> page = requestRepository.findByStudent_StudentId(student.getStudentId(), pageable);
        return PaginationUtil.toPageResponseDTO(page, UniversityJoinRequestMapper::toDto);
    }

}
