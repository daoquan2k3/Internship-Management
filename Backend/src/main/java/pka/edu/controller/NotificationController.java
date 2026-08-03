package pka.edu.controller;

import pka.edu.dto.request.PageRequestDTO;
import pka.edu.dto.response.ApiResponse;
import pka.edu.dto.response.NotificationResponse;
import pka.edu.dto.response.PageResponseDTO;
import pka.edu.service.impl.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping("/my-notifications")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PageResponseDTO<NotificationResponse>> getMyNotifications(@RequestParam(required = false) String search,
                                                                                    PageRequestDTO pageRequestDTO) {
        return ResponseEntity.ok(notificationService.getMyNotifications(search, pageRequestDTO));
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Đã đọc thông báo")
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/mark-all-as-read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        notificationService.markAllAsRead();
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Đã đánh dấu đọc toàn bộ thông báo")
                .build();
        return ResponseEntity.ok(response);
    }
}
