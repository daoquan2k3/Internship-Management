package pka.edu.dto.request;

import lombok.Data;

@Data
public class GradeReportRequest {
    private Double score;
    private String feedback;
}