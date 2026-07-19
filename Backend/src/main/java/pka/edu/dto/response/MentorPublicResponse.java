package pka.edu.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MentorPublicResponse {
    private Long id;
    private String fullName;
    private String department;
    private String academicRank;
    private String avatarUrl;
}
