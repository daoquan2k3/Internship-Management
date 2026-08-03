package pka.edu.service.impl;

import pka.edu.dto.request.UniversityRequest;
import pka.edu.dto.response.UniversityResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.entity.University;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.repository.UniversityRepository;
import pka.edu.service.IUniversityService;
import pka.edu.mapper.UniversityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UniversityServiceImpl implements IUniversityService {

    private final UniversityRepository universityRepository;

    @Override
    public UniversityResponse createUniversity(UniversityRequest request) {
        University university = new University();
        university.setUniversityName(request.getName());
        university.setAddress(request.getAddress());
        university.setEmail(request.getContactEmail());
        
        // Auto generate code if needed
        university.setUniversityCode("UNI-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        
        University saved = universityRepository.save(university);
        return UniversityMapper.toDto(saved);
    }

    @Override
    public PageResponseDTO<UniversityResponse> getAllUniversities(String search, Pageable pageable) {
        Page<University> page;
        if (search != null && !search.trim().isEmpty()) {
            page = universityRepository.findByUniversityNameContainingIgnoreCaseAndIsDeletedFalse(search, pageable);
        } else {
            page = universityRepository.findAll(pageable);
        }

        return PageResponseDTO.<UniversityResponse>builder()
                .content(page.getContent().stream().map(UniversityMapper::toDto).collect(Collectors.toList()))
                .page(page.getNumber() + 1)
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }

    @Override
    public UniversityResponse getUniversityById(Long id) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("University not found with id: " + id));
        return UniversityMapper.toDto(university);
    }

    @Override
    public UniversityResponse updateUniversity(Long id, UniversityRequest request) {
        return null;
    }

    @Override
    public void deleteUniversity(Long id) {

    }
}
