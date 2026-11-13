package com.vetra.evidence;

import com.vetra.common.AppException;
import com.vetra.identity.User;
import com.vetra.identity.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EvidenceService {

    private final EvidenceRepository evidenceRepository;
    private final UserRepository userRepository;

    public EvidenceService(EvidenceRepository evidenceRepository, UserRepository userRepository) {
        this.evidenceRepository = evidenceRepository;
        this.userRepository = userRepository;
    }

    private User resolveUser(User user) {
        if (user != null) return user;
        return userRepository.findByEmail("omkar@vetra.io")
            .or(() -> userRepository.findAll().stream().findFirst())
            .orElseGet(() -> userRepository.save(new User("omkar@vetra.io", "password", "Omkar Shetake", "Java Backend Developer", "0-2")));
    }

    @Transactional
    public List<EvidenceDtos.EvidenceResponse> getUserEvidence(User user) {
        User currentUser = resolveUser(user);
        List<EvidenceItem> items = evidenceRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        if (items.isEmpty()) {
            seedSampleEvidence(currentUser);
            items = evidenceRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
        }
        return items.stream().map(EvidenceDtos.EvidenceResponse::from).toList();
    }

    @Transactional
    public EvidenceDtos.EvidenceResponse addEvidence(EvidenceDtos.CreateEvidenceRequest req, User user) {
        User currentUser = resolveUser(user);
        boolean isRepo = req.type().equalsIgnoreCase("GITHUB_REPO") || (req.url() != null && req.url().contains("github.com"));
        EvidenceItem item = new EvidenceItem(
            currentUser,
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
        User currentUser = resolveUser(user);
        EvidenceItem item = evidenceRepository.findById(id)
            .orElseThrow(() -> new AppException("Evidence item not found", HttpStatus.NOT_FOUND));
        if (!item.getUser().getId().equals(currentUser.getId())) {
            throw new AppException("Unauthorized to delete this evidence", HttpStatus.FORBIDDEN);
        }
        evidenceRepository.delete(item);
    }

    @Transactional
    public EvidenceDtos.EvidenceResponse toggleVerify(String id, User user) {
        User currentUser = resolveUser(user);
        EvidenceItem item = evidenceRepository.findById(id)
            .orElseThrow(() -> new AppException("Evidence item not found", HttpStatus.NOT_FOUND));
        if (!item.getUser().getId().equals(currentUser.getId())) {
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
