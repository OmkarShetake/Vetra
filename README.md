# Vetra — Evidence-Based Career Intelligence Platform

<div align="center">

> **From authentic job requirements to verified, demonstrable engineering capabilities.**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-8E75C4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## 🌟 Executive Overview

Early-career software engineers often struggle with a critical career disconnect: **generic roadmaps, passive resume keyword stuffing, and unverified skill claims.** 

**Vetra** is an end-to-end, evidence-based career intelligence platform. It bridges the gap between authentic market demand and candidate proof:
1. **Parses & Benchmarks Real Job Postings**: Analyzes requirements across Product Base companies, High-Growth Startups, and Service Enterprises.
2. **Universal Dynamic Skill Graphs**: Synthesizes interactive Directed Acyclic Graphs (DAGs) with topological prerequisite dependencies for any industry role (preset or user-defined).
3. **Evidence-Grounded Skill Gap Analysis**: Calculates weighted readiness scores by validating claims against tangible code evidence, GitHub repositories, and assessments.
4. **AI-Powered Resume Studio**: Leverages Google Gemini 2.5 Flash to transform passive resume bullets into high-impact engineering accomplishments (`Action + Architecture + Quantifiable Outcome`) without hallucinating work history.

---

## 🚀 Core Platform Capabilities

### 1. Universal Dynamic Skill Explorer (Interactive DAG)
- **Topological Visual Graph**: Canvas-based interactive directed acyclic graph mapping skills across 5 sequential tiers:
  1. *Foundations & Languages*
  2. *Core Engineering & Patterns*
  3. *Frameworks & Persistent Storage*
  4. *Distributed Systems & Cloud Infrastructure*
  5. *Production Delivery & Observability*
- **Dynamic Role Synthesizer**: Built-in support for standard industry tracks (Frontend, Java Backend, Cloud/DevOps, Full Stack, AI/ML, Data Engineer, Golang, Mobile) plus a **Universal Novel Role Synthesizer** that dynamically generates complete 5-layer dependency graphs for *any* custom role typed by a user.
- **Node Intelligence**: Inspect prerequisites, dependent downstream skills, market demand metrics, and verifiable proof criteria with pan/zoom controls.

### 2. Job Market Intelligence & Company Situations
- **Company Archetype Classification**: Filter and analyze real-world JDs by company category:
  - 🏢 **Product Base**: Focus on high-concurrency architecture, test automation (JUnit/Mockito/Jest), code review rigor, and API versioning.
  - 🚀 **High-Growth Startup**: High-velocity execution, full-stack ownership, Docker containerization, and rapid feature iteration.
  - 🌐 **Service / Global Enterprise**: Scalable design patterns, structured workflows, cross-team collaboration, and clean documentation.
- **Situation Strategy & Salary Ranges**: Actionable strategic advice tailored to the target company's engineering culture and compensation brackets.
- **Direct JD Import**: Paste raw job descriptions to automatically extract required vs. preferred technologies.

### 3. Evidence-Grounded Skill Gap Analysis
- **Weighted Readiness Scoring**: Replaces binary checklists with a weighted algorithm considering skill criticalities (`CRITICAL`, `IMPORTANT`, `BENEFICIAL`).
- **Verifiable Proof Matching**: Segregates capabilities into **Demonstrated** (backed by verified code/repositories), **Partially Demonstrated** (self-declared/unverified), and **Critical Gaps** (unmet prerequisites).
- **Explainable Strategy**: Clear, natural-language career intelligence guiding candidates on what project or assessment to tackle next.

### 4. Resume Studio & Gemini AI Bullet Enhancer
- **Multi-Format Extraction**: Parses PDF resumes using Apache PDFBox 3 to extract skills, project achievements, and experience.
- **Live Gemini 2.5 Flash Enhancer**: Transforms weak or passive bullets into impactful engineering statements:
  - *Weak:* "Worked on Spring Boot backend for e-commerce website and created REST APIs."
  - *Vetra Enhanced:* "Engineered resilient Spring Boot RESTful microservices with PostgreSQL connection pooling, powering core checkout transactions and reducing API latency by 35%."
- **ATS Compatibility Scoring**: Real-time evaluation of section health, role alignment, and formatting.

### 5. Verifiable Evidence Portfolio & Technical Assessments
- **Proof-of-Work Portfolio**: Link GitHub repositories, deployed demo URLs, and certifications directly to specific skills in your taxonomy.
- **Skill Grounding**: Automated verification checks verifying that claims are backed by commit history and functional code.
- **Structured Assessments**: Timed, multi-choice technical assessments with passing grade thresholds to independently certify candidate proficiency.

### 6. Interactive Notification Center
- **Real-Time Navbar Center**: Categorized notifications (`ALL`, `UNREAD`, `ACHIEVEMENTS`, `ROADMAP`) tracking evidence verifications, assessment completions, and roadmap milestones with one-click clear and mark-all-read capabilities.

---

## 🛠️ Technology Stack

| Layer | Technologies | Purpose |
|-------|--------------|---------|
| **Frontend UI** | React 18, TypeScript, Vite, Tailwind CSS v4 | Ultra-responsive SPA with clean component hierarchy |
| **Design System** | shadcn/ui, Lucide Icons, Sonner | Modern dark/light theme design tokens |
| **Data Visualization** | Recharts, Custom Canvas DAG Engine | Interactive radial readiness gauges and skill dependency graphs |
| **Backend API** | Spring Boot 3.3.4, Java 21, Spring Security | Modular monolith with domain-driven boundary isolation |
| **Database** | PostgreSQL 16 (Neon Cloud / Production), H2 (Local File Dev) | Relational persistence with transactional integrity |
| **Migrations** | Flyway (V1 Schema, V2 Seed, V3 Multi-Track, V4 Archetypes) | Version-controlled automated database schema lifecycle |
| **Document Processing** | Apache PDFBox 3 | Secure server-side PDF resume parsing and tokenization |
| **Generative AI** | Google Gemini 2.5 Flash API | Low-latency, instruction-tuned resume bullet point optimization |
| **Infrastructure** | Docker, Nginx, Render (Backend), Vercel (Frontend) | Production-grade containerization and cloud deployment |

---

## 📂 Project Architecture

```
Vetra/
├── frontend/                        # React 18 + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/             # AppLayout, Sidebar, Navbar, NotificationsCenter
│   │   │   └── ui/                 # Accessible UI components (shadcn/ui)
│   │   ├── lib/
│   │   │   ├── api.ts              # Centralized typed HTTP client with JWT interceptor
│   │   │   ├── roleTaxonomy.ts     # Preset career paths + Universal 5-Layer DAG synthesizer
│   │   │   └── utils.ts            # Utility functions
│   │   ├── pages/                  # Route views (Dashboard, SkillExplorer, ResumeStudio, etc.)
│   │   └── styles/globals.css      # Midnight Navy & Indigo design tokens
│   ├── Dockerfile
│   └── package.json
│
├── backend/                         # Spring Boot 3.3 Modular Monolith
│   ├── src/main/java/com/vetra/
│   │   ├── common/                 # GlobalExceptionHandler, SecurityConfig, ApiResponse
│   │   ├── identity/               # User, JWT Token Provider, AuthController
│   │   ├── jobintelligence/        # Job entity, Archetypes, JD Parser, JobService
│   │   ├── skillintelligence/      # Skill taxonomy, Category mappings, SkillGraph
│   │   ├── skillgap/               # Weighted skill gap calculation engine
│   │   ├── resumeintelligence/     # PDFBox parsing, Gemini 2.5 AI enhancer integration
│   │   ├── evidence/               # Evidence portfolio items and skill verification
│   │   ├── assessment/             # Assessment questions, grading, and history
│   │   └── learningroadmap/        # Personalized phased learning plans
│   └── src/main/resources/
│       ├── application.yml         # Environment configurations (local vs. prod)
│       └── db/migration/           # Flyway migrations (V1 to V4)
│
├── docker-compose.yml              # Multi-container orchestration
└── README.md
```

---

## 💻 Local Quickstart

### Option A: Frontend Only (No Backend Required)
Explore the user interface immediately with embedded demo datasets:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

---

### Option B: Full-Stack (Frontend + Spring Boot Backend)

#### 1. Start the Backend
Make sure **JDK 21+** and **Maven** are installed.
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```
- Backend starts at: `http://localhost:8080`
- Health check: `http://localhost:8080/actuator/health` → `{"status":"UP"}`
- H2 Console: `http://localhost:8080/h2-console` (`jdbc:h2:file:./data/vetradb`, user: `sa`)
- Swagger UI: `http://localhost:8080/swagger-ui.html`

#### 2. Start the Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will proxy API requests (`/api/v1/*`) directly to `http://localhost:8080`.

---

### Option C: Multi-Container Docker Compose
Run the entire production-grade stack (PostgreSQL + Spring Boot + Nginx + Frontend):
```bash
docker compose up --build
```
Access the application on [http://localhost](http://localhost).

---

## ⚙️ Environment Variables

### Backend Configuration
| Variable | Description | Default / Mode |
|----------|-------------|----------------|
| `SPRING_PROFILES_ACTIVE` | Active configuration profile | `local` (H2) or `prod` (PostgreSQL) |
| `SPRING_DATASOURCE_URL` | JDBC Connection URL | Neon / PostgreSQL connection string |
| `SPRING_DATASOURCE_USERNAME` | Database username | PostgreSQL user |
| `SPRING_DATASOURCE_PASSWORD` | Database password | PostgreSQL password |
| `GEMINI_API_KEY` | Google Gemini API Key | Used for Live AI Bullet Enhancer |
| `JWT_SECRET` | 256-bit secret key for signing JWTs | Base64 encoded string |

### Frontend Configuration (`frontend/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | API Gateway base URL | `/api/v1` |
| `VITE_APP_NAME` | Platform branding | `Vetra` |

---

## 🗄️ Database Lifecycle & Flyway Migrations

Vetra enforces immutable, version-controlled database schema evolution via Flyway:
- **`V1__init_schema.sql`**: Baseline DDL defining users, profiles, roles, skills, jobs, evidence items, and assessments.
- **`V2__seed_taxonomy_and_roles.sql`**: Industry foundational skills, Java backend benchmarks, and sample assessments.
- **`V3__multi_track_taxonomy.sql`**: Multi-track expansion covering Frontend (React/TypeScript), DevOps (K8s/AWS), Full Stack, and AI/ML tracks.
- **`V4__add_company_type_to_jobs.sql`**: Introduces company archetypes (`PRODUCT`, `STARTUP`, `SERVICE`), salary ranges, and engineering situation strategies.

---

## 🔒 Security & Architecture Principles

- **Stateless JWT Authentication**: Secure Bearer tokens with 24-hour expiration, automated bearer interception, and role-based route guards.
- **Domain-Driven Modular Monolith**: Zero direct cross-package entity leaking; modules communicate strictly via typed DTOs and transactional service contracts.
- **Defensive Input Handling**: Multipart file validation with Apache PDFBox resource limits preventing memory exhaustion attacks.
- **Explainable Career Guidance**: No fabricated scores; every skill gap highlight directly cites the underlying job requirements and candidate evidence proof.

---

## 📄 License
This project is licensed under the MIT License.
