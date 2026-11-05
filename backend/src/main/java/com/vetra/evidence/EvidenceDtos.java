package com.vetra.evidence;

import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;

public class EvidenceDtos {

    public record CreateEvidenceRequest(
        @NotBlank String type,
        @NotBlank String title,
        String description,
        String url,
        List<String> linkedSkills
    ) {}

    public record EvidenceResponse(
        String id,
        String type,
        String title,
        String description,
        String url,
        boolean verified,
        List<String> linkedSkills,
        Instant createdAt
    ) {
        public static EvidenceResponse from(EvidenceItem item) {
            return new EvidenceResponse(
                item.getId(),
                item.getType(),
                item.getTitle(),
                item.getDescription(),
                item.getUrl(),
                item.isVerified(),
                item.getLinkedSkills(),
                item.getCreatedAt()
            );
        }
    }
}
