-- ============================================================================
-- VETRA - Flyway Migration V3: Multi-Domain Roles, Skills, and Job Postings
-- ============================================================================

-- 1. Modern Multi-Track Skills
INSERT INTO skills (id, name, category, description, demand_level) VALUES
-- Frontend & UI
('sk-react', 'React', 'FRAMEWORK', 'Component-based UI library, hooks, state management, Virtual DOM.', 93),
('sk-typescript', 'TypeScript', 'LANGUAGE', 'Typed superset of JavaScript, interfaces, generics, type safety.', 94),
('sk-javascript', 'JavaScript', 'LANGUAGE', 'Core web programming language, ES6+, event loop, async/await.', 96),
('sk-html-css', 'HTML5 & CSS3', 'LANGUAGE', 'Semantic markup, modern CSS layouts, Flexbox, Grid, responsive design.', 89),
('sk-tailwind', 'Tailwind CSS', 'FRAMEWORK', 'Utility-first CSS framework for rapid responsive component styling.', 85),
('sk-nextjs', 'Next.js', 'FRAMEWORK', 'React framework for server-side rendering, static site generation, API routes.', 88),

-- Full Stack & Node Ecosystem
('sk-nodejs', 'Node.js', 'FRAMEWORK', 'V8 JavaScript runtime for building scalable server-side applications.', 91),
('sk-express', 'Express.js', 'FRAMEWORK', 'Minimalist web framework for Node.js RESTful APIs and middleware.', 84),
('sk-mongodb', 'MongoDB', 'DATABASE', 'NoSQL document database, aggregation pipelines, flexible JSON schema.', 81),
('sk-graphql', 'GraphQL', 'CONCEPT', 'Declarative data query and manipulation language for APIs.', 78),

-- Cloud & DevOps
('sk-kubernetes', 'Kubernetes', 'TOOL', 'Container orchestration, pods, deployments, ingress, and cluster scaling.', 86),
('sk-aws', 'AWS', 'PLATFORM', 'Amazon Web Services: EC2, S3, RDS, Lambda, IAM, VPC cloud infrastructure.', 92),
('sk-terraform', 'Terraform', 'TOOL', 'Infrastructure as Code (IaC) for multi-cloud resource provisioning.', 82),
('sk-cicd', 'CI/CD Pipelines', 'CONCEPT', 'Continuous integration & delivery using GitHub Actions, Jenkins, or GitLab.', 87),
('sk-linux', 'Linux', 'PLATFORM', 'Unix/Linux shell scripting, server administration, process management.', 88),

-- Data & AI / ML
('sk-python', 'Python', 'LANGUAGE', 'General-purpose programming language for backend, automation, and AI/ML.', 95),
('sk-pandas', 'Pandas & NumPy', 'FRAMEWORK', 'Data manipulation, vector arrays, statistical analysis, and ETL pipelines.', 84),
('sk-pytorch', 'PyTorch', 'FRAMEWORK', 'Deep learning framework for neural networks, computer vision, and NLP.', 86),
('sk-fastapi', 'FastAPI', 'FRAMEWORK', 'High-performance Python web framework for building APIs and ML model endpoints.', 83),
('sk-llm', 'LLMs & Prompt Engineering', 'CONCEPT', 'Generative AI integration, embeddings, vector databases, LangChain.', 89),

-- Mobile
('sk-kotlin', 'Kotlin', 'LANGUAGE', 'Modern expressive language for Android and JVM backend development.', 83),
('sk-android', 'Android SDK', 'PLATFORM', 'Native Android application development, Jetpack Compose, activities, coroutines.', 82),
('sk-flutter', 'Flutter', 'FRAMEWORK', 'Google multi-platform framework for building mobile, web, and desktop apps.', 80)
ON CONFLICT (name) DO NOTHING;

-- 2. Multi-Track Role Profiles
INSERT INTO role_profiles (id, title, description, experience_level) VALUES
('role-frontend', 'Frontend Developer', 'Builds responsive, accessible, high-performance web applications using React, TypeScript, and modern CSS.', 'Entry to Mid'),
('role-fullstack', 'Full Stack Developer', 'Develops end-to-end web applications covering responsive frontends, server-side APIs, and relational/document databases.', 'Entry to Mid'),
('role-devops', 'Cloud & DevOps Engineer', 'Automates cloud infrastructure, manages Docker/Kubernetes container clusters, and builds robust CI/CD deployment pipelines.', 'Entry to Mid'),
('role-data-ai', 'Data & AI/ML Engineer', 'Designs data pipelines, machine learning model APIs, and Generative AI workflows using Python, SQL, and modern frameworks.', 'Entry to Mid'),
('role-mobile', 'Mobile Application Developer', 'Builds native or cross-platform mobile apps for Android or iOS with rich user interfaces and secure backend API sync.', 'Entry to Mid')
ON CONFLICT (title) DO NOTHING;

-- 3. Multi-Track Role Requirements
INSERT INTO role_profile_skills (role_id, skill_id, importance) VALUES
-- Frontend Developer Requirements
('role-frontend', 'sk-javascript', 'REQUIRED'),
('role-frontend', 'sk-typescript', 'REQUIRED'),
('role-frontend', 'sk-react', 'REQUIRED'),
('role-frontend', 'sk-html-css', 'REQUIRED'),
('role-frontend', 'sk-tailwind', 'REQUIRED'),
('role-frontend', 'sk-git', 'REQUIRED'),
('role-frontend', 'sk-nextjs', 'PREFERRED'),
('role-frontend', 'sk-rest-apis', 'REQUIRED'),

-- Full Stack Developer Requirements
('role-fullstack', 'sk-javascript', 'REQUIRED'),
('role-fullstack', 'sk-typescript', 'REQUIRED'),
('role-fullstack', 'sk-react', 'REQUIRED'),
('role-fullstack', 'sk-nodejs', 'REQUIRED'),
('role-fullstack', 'sk-sql', 'REQUIRED'),
('role-fullstack', 'sk-postgresql', 'REQUIRED'),
('role-fullstack', 'sk-rest-apis', 'REQUIRED'),
('role-fullstack', 'sk-docker', 'PREFERRED'),
('role-fullstack', 'sk-git', 'REQUIRED'),

-- Cloud & DevOps Requirements
('role-devops', 'sk-linux', 'REQUIRED'),
('role-devops', 'sk-docker', 'REQUIRED'),
('role-devops', 'sk-kubernetes', 'REQUIRED'),
('role-devops', 'sk-aws', 'REQUIRED'),
('role-devops', 'sk-cicd', 'REQUIRED'),
('role-devops', 'sk-git', 'REQUIRED'),
('role-devops', 'sk-terraform', 'PREFERRED'),
('role-devops', 'sk-python', 'PREFERRED'),

-- Data & AI/ML Requirements
('role-data-ai', 'sk-python', 'REQUIRED'),
('role-data-ai', 'sk-sql', 'REQUIRED'),
('role-data-ai', 'sk-pandas', 'REQUIRED'),
('role-data-ai', 'sk-fastapi', 'REQUIRED'),
('role-data-ai', 'sk-git', 'REQUIRED'),
('role-data-ai', 'sk-pytorch', 'PREFERRED'),
('role-data-ai', 'sk-docker', 'PREFERRED'),
('role-data-ai', 'sk-llm', 'PREFERRED'),

-- Mobile Requirements
('role-mobile', 'sk-kotlin', 'REQUIRED'),
('role-mobile', 'sk-android', 'REQUIRED'),
('role-mobile', 'sk-rest-apis', 'REQUIRED'),
('role-mobile', 'sk-git', 'REQUIRED'),
('role-mobile', 'sk-flutter', 'PREFERRED')
ON CONFLICT DO NOTHING;

-- 4. Multi-Track Sample Jobs
INSERT INTO jobs (id, title, company, location, experience_level, employment_type, source, description) VALUES
('job-fe-1', 'Frontend React Developer', 'Vercel / Next Technologies', 'Remote / Bengaluru', '0-2 years', 'FULL_TIME', 'INTERNAL', 'Looking for a passionate Frontend Engineer skilled in React 18, TypeScript, Tailwind CSS, and REST API consumption. Strong design sense and responsive layout skills required.'),
('job-fs-1', 'Full Stack Software Engineer', 'Stripe Systems', 'Remote / Hyderabad', '1-3 years', 'FULL_TIME', 'INTERNAL', 'Join our core platform team building end-to-end developer experiences. Strong knowledge of TypeScript, Node.js, React, PostgreSQL, and Docker containerization.'),
('job-do-1', 'Associate Cloud & DevOps Engineer', 'Cloudflare Partner Labs', 'Remote / Pune', '0-2 years', 'FULL_TIME', 'INTERNAL', 'Manage automated CI/CD deployment pipelines with GitHub Actions, containerize microservices using Docker, and assist with Kubernetes and AWS infrastructure monitoring.'),
('job-ai-1', 'Junior AI & Python Backend Developer', 'Cohere Labs Partner', 'Remote / Mumbai', '0-2 years', 'FULL_TIME', 'INTERNAL', 'Develop high-performance REST APIs with FastAPI, integrate LLM embeddings, clean structured datasets with Pandas/SQL, and deploy scalable ML services with Docker.')
ON CONFLICT (id) DO NOTHING;

-- Job Required Skills
INSERT INTO job_required_skills (job_id, skill_name) VALUES
('job-fe-1', 'React'), ('job-fe-1', 'TypeScript'), ('job-fe-1', 'JavaScript'), ('job-fe-1', 'Tailwind CSS'), ('job-fe-1', 'Git'),
('job-fs-1', 'React'), ('job-fs-1', 'TypeScript'), ('job-fs-1', 'Node.js'), ('job-fs-1', 'PostgreSQL'), ('job-fs-1', 'Docker'), ('job-fs-1', 'Git'),
('job-do-1', 'Linux'), ('job-do-1', 'Docker'), ('job-do-1', 'Kubernetes'), ('job-do-1', 'AWS'), ('job-do-1', 'CI/CD Pipelines'), ('job-do-1', 'Git'),
('job-ai-1', 'Python'), ('job-ai-1', 'SQL'), ('job-ai-1', 'FastAPI'), ('job-ai-1', 'Pandas & NumPy'), ('job-ai-1', 'Docker'), ('job-ai-1', 'Git')
ON CONFLICT DO NOTHING;
