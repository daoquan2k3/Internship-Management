package pka.edu.service.impl;

import pka.edu.dto.response.InternshipPlacementResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.entity.*;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.mapper.InternshipPlacementMapper;
import pka.edu.repository.*;
import pka.edu.service.IInternshipPlacementService;
import pka.edu.util.PaginationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InternshipPlacementServiceImpl implements IInternshipPlacementService {
    private final InternshipPlacementRepository placementRepository;
    private final InternshipApplicationRepository applicationRepository;
    private final CompanyRepository companyRepository;
    private final MentorRepository mentorRepository;
    private final StudentRepository studentRepository;

    @Override
    @Transactional
    public InternshipPlacementResponse createPlacement(Long applicationId) {
        InternshipApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (placementRepository.findByStudent_StudentIdAndUniversityClass_ClassId(
                app.getStudent().getStudentId(), app.getUniversityClass().getClassId()).isPresent()) {
            throw new ResourceConflictException("Placement already exists for this student in this class");
        }

        InternshipPlacement placement = InternshipPlacement.builder()
                .student(app.getStudent())
                .universityClass(app.getUniversityClass())
                .companyName(app.getCompanyName())
                .taxCode(app.getTaxCode())
                .position(app.getPosition())
                .build();

        return InternshipPlacementMapper.toDto(placementRepository.save(placement));
    }

    @Override
    @Transactional
    public InternshipPlacementResponse assignCompany(Long placementId, Long companyId) {
        InternshipPlacement placement = placementRepository.findById(placementId)
                .orElseThrow(() -> new ResourceNotFoundException("Placement not found"));
        
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

        placement.setCompany(company);
        return InternshipPlacementMapper.toDto(placementRepository.save(placement));
    }

    @Override
    @Transactional
    public InternshipPlacementResponse assignMentor(Long placementId, Long mentorId) {
        InternshipPlacement placement = placementRepository.findById(placementId)
                .orElseThrow(() -> new ResourceNotFoundException("Placement not found"));
        
        Mentor mentor = mentorRepository.findById(mentorId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));

        placement.setMentor(mentor);
        
        // Sync mentor info to student's external mentor fields (for profile display)
        Student student = placement.getStudent();
        if (student != null && mentor.getUser() != null) {
            student.setExternalMentorName(mentor.getUser().getFullName());
            student.setExternalMentorPhone(mentor.getUser().getPhoneNumber());
            studentRepository.save(student);
        }

        return InternshipPlacementMapper.toDto(placementRepository.save(placement));
    }

    @Override
    public PageResponseDTO<InternshipPlacementResponse> getPlacementsByClass(Long classId, Pageable pageable) {
        Page<InternshipPlacement> page = placementRepository.findByUniversityClass_ClassId(classId, pageable);
        return PaginationUtil.toPageResponseDTO(page, InternshipPlacementMapper::toDto);
    }

    @Override
    public PageResponseDTO<InternshipPlacementResponse> getMyPlacements(Long studentUserId, Pageable pageable) {
        Student student = studentRepository.findByUser_UserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        Page<InternshipPlacement> page = placementRepository.findByStudent_StudentId(student.getStudentId(), pageable);
        return PaginationUtil.toPageResponseDTO(page, InternshipPlacementMapper::toDto);
    }

    @Override
    public PageResponseDTO<InternshipPlacementResponse> getPlacementsForCompany(Long companyUserId, Pageable pageable) {
        Page<InternshipPlacement> page = placementRepository.findByCompany_CompanyId(companyUserId, pageable);
        return PaginationUtil.toPageResponseDTO(page, InternshipPlacementMapper::toDto);
    }

    @Override
    public PageResponseDTO<InternshipPlacementResponse> getPlacementsForMentor(Long mentorUserId, Pageable pageable) {
        Page<InternshipPlacement> page = placementRepository.findByMentor_MentorId(mentorUserId, pageable);
        return PaginationUtil.toPageResponseDTO(page, InternshipPlacementMapper::toDto);
    }

}
