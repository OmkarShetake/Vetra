package com.vetra.evidence;

import com.vetra.common.AppException;
import com.vetra.identity.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EvidenceService {

    private final EvidenceRepository evidenceRepository;

    public EvidenceService(EvidenceRepository evidenceRepository) {
        this.evidenceRepository = evidenceRepository;
    }

    @Transactional(readOnly = true)
    public List<EvidenceDtos.EvidenceResponse> getUserEvidence(User user) {
        List<EvidenceItem> items = evidenceRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        if (items.isEmpty()) {
            seedSampleEvidence(user);
            items = evidenceRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        }
        return items.stream().map(EvidenceDtos.EvidenceResponse::from).toList();
    }

    @Transactional
    public EvidenceDtos.EvidenceResponse addEvidence(EvidenceDtos.CreateEvidenceRequest req, User user) {
        boolean isRepo = req.type().equalsIgnoreCase("GITHUB_REPO") || (req.url() != null && req.url().contains("github.com"));
        EvidenceItem item = new EvidenceItem(
            user,
            req.type(),
            req.title(),
            req.description(),
            req.url(),
            req.linkedSkills() != null ? req.linkedSkills() : List.of(),
            isRepo // Auto-verify linked GitHub repository
        );
        item = evidenceRepository.save(item);
        return EvidenceDtos.EvidenceResponse.from(item);
    }

    @Transactional
    public void deleteEvidence(String id, User user) {
        EvidenceItem item = evidenceRepository.findById(id)
            .orElseThrow(() -> new AppException("Evidence item not found", HttpStatus.NOT_FOUND));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new AppException("Unauthorized to delete this evidence", HttpStatus.FORBIDDEN);
        }
        evidenceRepository.delete(item);
    }

    @Transactional
    public EvidenceDtos.EvidenceResponse toggleVerify(String id, User user) {
        EvidenceItem item = evidenceRepository.findById(id)
            .orElseThrow(() -> new AppException("Evidence item not found", HttpStatus.NOT_FOUND));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new AppException("Unauthorized to modify this evidence", HttpStatus.FORBIDDEN);
        }
        item.setVerified(!item.isVerified());
        item = evidenceRepository.save(item);
        return EvidenceDtos.EvidenceResponse.from(item);
    }

    private void seedSampleEvidence(User user) {
        EvidenceItem item1 = new EvidenceItem(
            user,
            "PROJECT",
            "E-Commerce REST API",
            "Spring Boot REST API with JWT auth, product catalog, and order management. Uses PostgreSQL and Redis caching.",
            "https://github.com/example/ecommerce-api",
            List.of("Java", "Spring Boot", "PostgreSQL", "REST APIs"),
            true
        );
        EvidenceItem item2 = new EvidenceItem(
            user,
            "GITHUB_REPO",
            "student-management-system",
            "Java console-based student management system with CRUD operations and file persistence.",
            "https://github.com/example/student-mgmt",
            List.of("Java", "OOP", "Collections"),
            true
        );
        evidenceRepository.saveAll(List.of(item1, item2));
    }
}
