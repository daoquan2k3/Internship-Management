package pka.edu.dto.response;
import lombok.*;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class JwtResponse {
    private String accessToken;
    private String refreshToken;
    private final String type = "Bearer";
    private String username;
    private Date expiresIn;
    private UserResponse user;
}
