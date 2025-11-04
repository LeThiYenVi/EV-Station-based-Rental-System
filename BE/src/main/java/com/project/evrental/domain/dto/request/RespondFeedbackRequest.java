package com.project.evrental.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RespondFeedbackRequest {

    @NotBlank(message = "Response is required")
    @Size(min = 10, max = 1000, message = "Response must be between 10 and 1000 characters")
    private String response;
}