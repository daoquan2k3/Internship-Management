package pka.edu.controller;

import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.request.StudentCreateRequest;
import pka.edu.dto.request.StudentUpdateRequest;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.dto.response.StudentResponse;
import pka.edu.exception.ResourceBadRequestException;
import pka.edu.exception.ResourceConflictException;
import pka.edu.exception.ResourceForbiddenException;
import pka.edu.exception.ResourceNotFoundException;
import pka.edu.service.IStudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {
    private final IStudentService studentService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<StudentResponse>> createStudent(@Valid @RequestBody StudentCreateRequest request) throws ResourceConflictException, ResourceNotFoundException, ResourceBadRequestException, ResourceForbiddenException {
        return new ResponseEntity<>(studentService.createStudent(request), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_MENTOR')")
    public ResponseEntity<PageResponseDTO<StudentResponse>> getAllStudent(@ModelAttribute PageRequestDTO page) throws ResourceNotFoundException, ResourceForbiddenException {
        return new ResponseEntity<>(studentService.getAllStudent(page), HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<StudentResponse>> getCurrentStudentInfo() throws ResourceNotFoundException, ResourceForbiddenException {
        return new ResponseEntity<>(studentService.getCurrentStudentInfo(), HttpStatus.OK);
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(@PathVariable Long studentId) throws ResourceNotFoundException, ResourceForbiddenException {
        return new ResponseEntity<>(studentService.getStudentById(studentId), HttpStatus.OK);
    }

    @PutMapping("/{studentId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(@PathVariable Long studentId, @Valid @RequestBody StudentUpdateRequest request) throws ResourceNotFoundException, ResourceBadRequestException, ResourceForbiddenException, ResourceConflictException {
        return new ResponseEntity<>(studentService.updateStudent(studentId, request), HttpStatus.OK);
    }
}
