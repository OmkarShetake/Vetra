-- ============================================================================
-- VETRA - Flyway Migration V4: Add company archetypes & situation advice to jobs
-- ============================================================================

ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS company_type VARCHAR(50) DEFAULT 'PRODUCT',
ADD COLUMN IF NOT EXISTS salary_range VARCHAR(100) DEFAULT 'Competitive',
ADD COLUMN IF NOT EXISTS situation_advice TEXT;

-- Update existing records to reasonable defaults
UPDATE jobs SET company_type = 'PRODUCT' WHERE company_type IS NULL;
UPDATE jobs SET salary_range = 'Competitive' WHERE salary_range IS NULL;

-- Enrich existing sample jobs with archetype contexts
UPDATE jobs 
SET company_type = 'PRODUCT', 
    salary_range = '₹12 - ₹18 LPA / $85k - $115k',
    situation_advice = 'Top priority on automated unit/integration tests, clean REST API contracts, and high availability systems.'
WHERE id = 'job-fe-1';

UPDATE jobs 
SET company_type = 'PRODUCT', 
    salary_range = '₹14 - ₹22 LPA / $95k - $130k',
    situation_advice = 'Product-grade code reviews, end-to-end type safety, microservice communication, and PostgreSQL transaction isolation.'
WHERE id = 'job-fs-1';

UPDATE jobs 
SET company_type = 'STARTUP', 
    salary_range = '₹10 - ₹16 LPA / $75k - $105k',
    situation_advice = 'Fast-paced execution, CI/CD pipeline automation, Docker container orchestration, and rapid debugging in cloud environments.'
WHERE id = 'job-do-1';

UPDATE jobs 
SET company_type = 'STARTUP', 
    salary_range = '₹12 - ₹20 LPA / $90k - $125k',
    situation_advice = 'Rapid experimentation, Python FastAPI endpoints, LLM model grounding, and vector search integration.'
WHERE id = 'job-ai-1';
