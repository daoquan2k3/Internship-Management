package pka.edu.security.principal;

import pka.edu.entity.User;
import pka.edu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserDetailServiceCustom implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User users = userRepository.findByUsernameAndIsDeletedFalseAndIsActiveTrue(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return UserPrincipal.builder()
                .users(users)
                .authorities(
                        users.getRole() != null
                                ? Collections.singleton(new SimpleGrantedAuthority(users.getRole().name()))
                                : Collections.emptyList()
                )
                .build();
    }
}
