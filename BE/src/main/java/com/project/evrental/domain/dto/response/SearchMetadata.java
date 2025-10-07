package com.project.evrental.domain.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SearchMetadata {

    Integer totalResults;
    
    Integer radiusKm;
    
    Integer returnedCount;
    
    LocalDateTime searchTime;
    
}
