package com.vetra;

import com.vetra.skillgap.SkillGapDtos;
import com.vetra.skillgap.SkillGapService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SkillGapServiceTest {

    @Test
    void testAnalyzeGapCalculatesScoreAndBreakdown() {
        SkillGapService service = new SkillGapService();
        SkillGapDtos.AnalyzeGapRequest req = new SkillGapDtos.AnalyzeGapRequest("Java Backend Developer", null);

        SkillGapDtos.SkillGapAnalysisResponse res = service.analyzeGap(req, null);

        assertNotNull(res);
        assertEquals("Java Backend Developer", res.targetRole());
        assertTrue(res.overallScore() > 0 && res.overallScore() <= 100);
        assertTrue(res.demonstratedCount() > 0);
        assertFalse(res.skills().isEmpty());
    }
}
