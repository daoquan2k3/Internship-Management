package pka.edu.config;

import pka.edu.dto.response.ApiResponse;
import pka.edu.entity.Student;
import pka.edu.entity.User;
import pka.edu.util.CurrentUserUtil;
import pka.edu.util.enums.Role;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class ProfileCompletionInterceptor implements HandlerInterceptor {

    private final CurrentUserUtil currentUserUtil;
    private final ObjectMapper objectMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        if (uri.startsWith("/api/v1/auth") || method.equals("OPTIONS")) {
            return true;
        }

        if (uri.equals("/api/v1/users/me") && method.equals("GET")) {
            return true;
        }

        if(uri.equals("/api/v1/notifications")){
            return true;
        }

        if (uri.matches("^/api/v1/(students|mentors|users)(/.+)?$") && (method.equals("PUT") || method.equals("POST"))) {
            return true;
        }

        User user = currentUserUtil.getCurrentUser();
        if (user == null || user.getRole() == Role.ROLE_ADMIN) return true;

        boolean isProfileIncomplete = false;

        if (user.getFullName() == null || user.getFullName().trim().isEmpty() || user.getPhoneNumber() == null) {
            isProfileIncomplete = true;
        }
        // Check riêng Student
        else if (user.getRole() == Role.ROLE_STUDENT && user.getStudent() != null) {
            Student s = user.getStudent();
            if (s.getMajor() == null || s.getClassRoom() == null) {
                isProfileIncomplete = true;
            }
        }
        // Check riêng Mentor
        else if (user.getRole() == Role.ROLE_MENTOR && user.getMentor() != null) {
            if (user.getMentor().getDepartment() == null) {
                isProfileIncomplete = true;
            }
        }

        if (isProfileIncomplete) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
            response.setContentType("application/json;charset=UTF-8");

            ApiResponse<?> apiResponse = new ApiResponse<>(null, false, "INCOMPLETE_PROFILE", "Vui lòng cập nhật đầy đủ hồ sơ trước khi sử dụng tính năng này.", LocalDateTime.now());
            response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
            return false;
        }

        return true;
    }
}