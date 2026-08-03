package pka.edu.service.impl;

import pka.edu.dto.request.UniversityClassRequest;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.dto.response.UniversityClassResponse;
import pka.edu.entity.University;
import pka.edu.entity.UniversityClass;
import pka.edu.entity.User;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.mapper.UniversityClassMapper;
import pka.edu.repository.UserRepository;
import pka.edu.repository.UniversityClassRepository;
import pka.edu.service.IUniversityClassService;
import pka.edu.util.PaginationUtil;
import pka.edu.util.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UniversityClassServiceImpl implements IUniversityClassService {
    private final UniversityClassRepository classRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public UniversityClassResponse createClass(UniversityClassRequest request, Long universityRepId) {
        User rep = userRepository.findById(universityRepId)
                .orElseThrow(() -> new ResourceNotFoundException("University rep not found"));

        if (rep.getRole() != Role.ROLE_UNIVERSITY_REP && rep.getRole() != Role.ROLE_ADMIN) {
            throw new ResourceConflictException("Only university rep can create class");
        }

        University university = rep.getUniversity();
        if (university == null) {
            throw new ResourceConflictException("Rep does not belong to any university");
        }

        User teacher = null;
        if (request.getTeacherId() != null) {
            teacher = userRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
            if (teacher.getRole() != Role.ROLE_TEACHER) {
                throw new ResourceConflictException("Assigned user must have ROLE_TEACHER");
            }
        }

        UniversityClass universityClass = UniversityClass.builder()
                .className(request.getClassName())
                .academicYear(request.getAcademicYear())
                .semester(request.getSemester())
                .maxStudents(request.getMaxStudents() != null ? request.getMaxStudents() : 50)
                .university(university)
                .teacher(teacher)
                .isActive(true)
                .build();

        return UniversityClassMapper.toDto(classRepository.save(universityClass));
    }

    @Override
    @Transactional
    public UniversityClassResponse updateClass(Long classId, UniversityClassRequest request, Long universityRepId) {
        User rep = userRepository.findById(universityRepId)
                .orElseThrow(() -> new ResourceNotFoundException("University rep not found"));

        if (rep.getRole() != Role.ROLE_UNIVERSITY_REP && rep.getRole() != Role.ROLE_ADMIN) {
            throw new ResourceConflictException("Only university rep can update class");
        }

        UniversityClass universityClass = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        if (request.getClassName() != null && !request.getClassName().isBlank()) {
            universityClass.setClassName(request.getClassName());
        }
        if (request.getAcademicYear() != null) {
            universityClass.setAcademicYear(request.getAcademicYear());
        }
        if (request.getSemester() != null) {
            universityClass.setSemester(request.getSemester());
        }
        if (request.getMaxStudents() != null) {
            universityClass.setMaxStudents(request.getMaxStudents());
        }
        if (request.getTeacherId() != null) {
            User teacher = userRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
            if (teacher.getRole() != Role.ROLE_TEACHER) {
                throw new ResourceConflictException("Assigned user must have ROLE_TEACHER");
            }
            universityClass.setTeacher(teacher);
        }

        return UniversityClassMapper.toDto(classRepository.save(universityClass));
    }

    @Override
    @Transactional
    public UniversityClassResponse assignTeacher(Long classId, Long teacherId, Long universityRepId) {
        User rep = userRepository.findById(universityRepId)
                .orElseThrow(() -> new ResourceNotFoundException("University rep not found"));

        if (rep.getRole() != Role.ROLE_UNIVERSITY_REP && rep.getRole() != Role.ROLE_ADMIN) {
            throw new ResourceConflictException("Only university rep can assign a teacher");
        }

        UniversityClass universityClass = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        if (!universityClass.getUniversity().getUniversityId().equals(rep.getUniversity().getUniversityId())) {
            throw new ResourceConflictException("You don't have permission for this class");
        }

        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        if (teacher.getRole() != Role.ROLE_TEACHER) {
            throw new ResourceConflictException("Assigned user must have ROLE_TEACHER");
        }

        universityClass.setTeacher(teacher);
        return UniversityClassMapper.toDto(classRepository.save(universityClass));
    }

    @Override
    public PageResponseDTO<UniversityClassResponse> getClassesByUniversity(Long universityId, Pageable pageable) {
        Page<UniversityClass> page = classRepository.findByUniversity_UniversityId(universityId, pageable);
        return PaginationUtil.toPageResponseDTO(page, UniversityClassMapper::toDto);
    }

    @Override
    public PageResponseDTO<UniversityClassResponse> getClassesByTeacher(Long teacherId, Pageable pageable) {
        Page<UniversityClass> page = classRepository.findByTeacher_UserId(teacherId, pageable);
        return PaginationUtil.toPageResponseDTO(page, UniversityClassMapper::toDto);
    }

    @Override
    public PageResponseDTO<UniversityClassResponse> getAllClasses(Pageable pageable) {
        Page<UniversityClass> page = classRepository.findAll(pageable);
        return PaginationUtil.toPageResponseDTO(page, UniversityClassMapper::toDto);
    }

    @Override
    public PageResponseDTO<UniversityClassResponse> getMyClasses(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Page<UniversityClass> page;
        if (user.getRole() == Role.ROLE_ADMIN) {
            page = classRepository.findAll(pageable);
        } else if (user.getRole() == Role.ROLE_UNIVERSITY_REP && user.getUniversity() != null) {
            page = classRepository.findByUniversity_UniversityId(user.getUniversity().getUniversityId(), pageable);
        } else if (user.getRole() == Role.ROLE_TEACHER) {
            page = classRepository.findByTeacher_UserId(userId, pageable);
        } else {
            page = Page.empty();
        }
        return PaginationUtil.toPageResponseDTO(page, UniversityClassMapper::toDto);
    }
}
