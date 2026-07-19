package pka.edu.util;

import pka.edu.entity.User;
import pka.edu.security.principal.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CurrentUserUtil {

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 1. Nếu chưa có xác thực hoặc chưa đăng nhập thì trả về null
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        // 2. Lấy principal ra kiểm tra
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) principal;
            return userPrincipal.getUsers(); // Trả về entity User của bạn
        }

        return null;
    }
}
