package pka.edu.security.jwt;

import pka.edu.entity.User;
import pka.edu.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = getTokenFromRequest(request); // lay token tu header
            if (token != null &&
                    jwtProvider.validateToken(token, request) &&
                    jwtProvider.getTypeFromToken(token).equals("access") &&
                    !isTokenBlacklisted(token)) {
                String username = jwtProvider.getUsernameFromToken(token);


                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                User users = userRepository.findByUsernameAndIsDeletedFalseAndIsActiveTrue(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

                if (users.isActive() && !users.isDeleted()) {
                    // set vào security context để spring có thể sử dụng thông tin này cho các bước tiếp theo
                    SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    ));
                } else {
                    log.error("User {} is not active or has been deleted", username);
                    return;
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        filterChain.doFilter(request, response); // cho phep request tiếp tục đi tiep
    }

    // get token from request
    private String getTokenFromRequest(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        return null;
    }

    private boolean isTokenBlacklisted(String token) {
        return tokenBlacklistService.isTokenBlacklisted(token);
    }
}
