package com.vetra.common.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * Service integrating with Google Gemini AI API (Gemini 1.5 Flash).
 * Used for deep semantic resume extraction, JD skill parsing, and bullet point rewriting.
 */
@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    private final RestClient restClient;
    private final String apiKey;

    public GeminiService(@Value("${vetra.gemini.api-key:}") String apiKey) {
        this.apiKey = apiKey;
        this.restClient = RestClient.builder().build();
    }

    /**
     * Checks if Gemini API key is configured.
     */
    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    /**
     * Prompt Gemini to analyze a resume against a target role.
     */
    public String analyzeResumeWithAi(String resumeText, String targetRole) {
        if (!isConfigured()) {
            log.info("Gemini API key not configured; skipping AI deep analysis.");
            return null;
        }

        String prompt = """
            You are a strict, senior technical recruiter and ATS specialist for %s roles.
            Analyze the following resume text extracted from a candidate's CV.
            
            Rules:
            1. Never invent or hallucinate experience, companies, or tools the candidate did not mention.
            2. Identify:
               - Explicit demonstrated technical skills
               - Indirect / implied technical skills
               - Critical missing skills for %s
               - 3 actionable, factual recommendations to improve the resume
            
            Resume Text:
            \"\"\"
            %s
            \"\"\"
            """.formatted(targetRole, targetRole, truncateText(resumeText, 8000));

        return callGemini(prompt);
    }

    /**
     * Prompt Gemini to rewrite a weak resume bullet point into an impact-oriented statement.
     */
    public String rewriteBulletPoint(String bulletPoint) {
        if (!isConfigured()) return null;

        String prompt = """
            You are a senior software engineering career coach.
            Rewrite this resume bullet point using the formula: Action Verb + Architecture/Tool + Quantifiable Outcome.
            Do not fabricate statistics or false claims; suggest how to frame the technical scope cleanly.
            
            Original bullet:
            \"%s\"
            
            Provide 2 improved alternatives and a brief explanation why.
            """.formatted(bulletPoint);

        return callGemini(prompt);
    }

    /**
     * Low-level call to Gemini REST API.
     */
    private String callGemini(String prompt) {
        try {
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of(
                        "parts", List.of(
                            Map.of("text", prompt)
                        )
                    )
                )
            );

            Map response = restClient.post()
                .uri(GEMINI_API_URL + "?key=" + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

            if (response != null && response.containsKey("candidates")) {
                List candidates = (List) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map first = (Map) candidates.get(0);
                    Map content = (Map) first.get("content");
                    List parts = (List) content.get("parts");
                    Map firstPart = (Map) parts.get(0);
                    return (String) firstPart.get("text");
                }
            }
        } catch (Exception e) {
            log.warn("Gemini API call failed: {}", e.getMessage());
        }
        return null;
    }

    private String truncateText(String text, int maxChars) {
        if (text == null) return "";
        return text.length() <= maxChars ? text : text.substring(0, maxChars);
    }
}
