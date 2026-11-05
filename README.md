# Vetra — Evidence-Based Career Intelligence Platform

> **From job requirements to proven capabilities.**

Vetra helps students and early-career developers understand what companies actually require, identify their skill gaps, improve their resumes with evidence, and prove their capabilities through structured assessments and portfolios.

---

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
  - [Frontend Only](#frontend-only-no-backend-required)
  - [Full Stack (Frontend + Backend)](#full-stack-frontend--backend)
  - [Docker Compose](#docker-compose)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Feature Status](#feature-status)
- [Design System](#design-system)
- [Architecture](#architecture)

---

## Overview

Vetra is a **modular monolith** SaaS platform connecting four things:

1. **Real job descriptions** and industry skill demand data
2. A **skill graph** showing relationships and prerequisites between technologies
3. A user's **demonstrated skills**, projects, and evidence
4. **Resume analysis** and personalized career improvement recommendations

**Target users:** CS/IT students, fresh graduates, early-career software engineers.

**Initial focus roles:** Java Backend Developer, Software Engineer, Spring Boot Developer.

---

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Lucide Icons, Recharts, React Router v6, TanStack Query, React Hook Form + Zod, Sonner (toasts) |
| **Backend** | Java 23, Spring Boot 3.3, Spring Security, JWT (JJWT 0.12), Spring Data JPA / Hibernate |
| **Database** | H2 (local/dev, in-memory), PostgreSQL (production) |
| **Migrations** | Flyway (production only; H2 uses `ddl-auto: update`) |
| **Document Parsing** | Apache PDFBox 3 |
| **API Docs** | SpringDoc OpenAPI (Swagger UI) |
| **Infrastructure** | Docker, Docker Compose, Nginx |

---

## Project Structure

```
Vetra/
├── frontend/                   # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # AppLayout, Sidebar, TopNav, ThemeProvider
│   │   │   └── ui/            # Design system components (shadcn/ui)
│   │   ├── hooks/             # useAuth
│   │   ├── lib/               # api.ts, utils.ts
│   │   ├── pages/             # All page components
│   │   │   └── auth/          # Login, Register, ForgotPassword
│   │   ├── styles/            # globals.css — Vetra design system
│   │   └── types/             # TypeScript type definitions
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── backend/                    # Spring Boot modular monolith
│   └── src/main/java/com/vetra/
│       ├── common/            # ApiResponse, AppException, GlobalExceptionHandler, SecurityConfig
│       ├── identity/          # User, JWT, AuthController, AuthService
│       ├── userprofile/       # UserProfile, ProfileController, ProfileService
│       ├── jobintelligence/   # Job, JobController, JobService
│       ├── skillintelligence/ # Skill, SkillGraph, SkillController
│       ├── skillgap/          # SkillGapAnalysis, SkillGapController
│       ├── resumeintelligence/# Resume, ResumeController, ResumeService (PDFBox)
│       ├── evidence/          # EvidenceItem, EvidenceController
│       ├── assessment/        # Assessment, AssessmentAttempt, AssessmentController
│       └── learningroadmap/   # LearningPlan, LearningTask, RoadmapController
│   └── src/main/resources/
│       ├── application.yml    # Multi-profile: local (H2) | prod (PostgreSQL)
│       └── db/migration/      # Flyway V1 (schema) + V2 (seed data)
│
├── docker-compose.yml
└── README.md
```

---

## Prerequisites

| Tool | Minimum Version | Notes |
|------|----------------|-------|
| **Node.js** | 20+ | Tested with v24.14.1 |
| **npm** | 10+ | Comes with Node |
| **Java JDK** | 21+ | Tested with JDK 23 at `C:\Program Files\Java\jdk-23` |
| **Maven** | 3.9+ | At `C:\Users\Omkar Shetake\apache-maven-3.9.11` |
| **Docker** | 24+ | Optional — for containerized run |
| **PostgreSQL** | 15+ | Optional — only needed for production profile |

---

## Local Development Setup

### Frontend Only (No Backend Required)

The frontend runs with demo data when no backend is available. Auth routes will fail gracefully.

```powershell
cd frontend
npm install
npm run dev
```

App runs at: **http://localhost:5173**

> **Note:** Without the backend, login/register will fail. To explore all pages, the UI shows clearly-labeled demo data.

---

### Full Stack (Frontend + Backend)

**Step 1 — Start the backend:**

```powershell
cd backend

# Set JAVA_HOME (adjust path if different)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-23"

# Add Maven to PATH (adjust path if different)
$env:PATH = "C:\Users\Omkar Shetake\apache-maven-3.9.11\bin;" + $env:PATH

# Run with local profile (H2 in-memory database — no PostgreSQL needed)
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Backend starts at: **http://localhost:8080**

Verify: **http://localhost:8080/actuator/health** → `{"status":"UP"}`

H2 Console (dev only): **http://localhost:8080/h2-console**
- JDBC URL: `jdbc:h2:mem:vetradb`
- Username: `sa` / Password: (blank)

**Step 2 — Start the frontend:**

```powershell
cd frontend
npm install
npm run dev
```

Frontend proxies `/api/v1/*` → `http://localhost:8080/api/v1/*` via Vite config.

---

### Docker Compose

Runs PostgreSQL + backend + frontend behind Nginx.

```bash
# From project root
docker compose up --build
```

App available at: **http://localhost** (Nginx on port 80)

> **First run:** Docker will build both images (~3–5 min). Flyway will apply V1 and V2 migrations automatically.

**Stop:**
```bash
docker compose down
```

**Stop and remove volumes (reset DB):**
```bash
docker compose down -v
```

---

## Environment Variables

### Frontend (Vite)

Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=/api/v1
```

### Backend (Spring Boot — Production)

Set these as environment variables or in `application-prod.yml`:

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `vetradb` |
| `DB_USERNAME` | DB username | `vetra` |
| `DB_PASSWORD` | DB password | *(secure value)* |
| `JWT_SECRET` | JWT signing secret (min 256 bits) | *(generate with openssl)* |
| `JWT_EXPIRATION_MS` | Access token TTL in ms | `86400000` (24h) |

Generate a secure JWT secret:
```bash
openssl rand -base64 64
```

> **Never commit secrets.** The default `application.yml` contains a placeholder JWT secret for local development only.

---

## API Documentation

With the backend running (local or Docker):

- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **OpenAPI JSON:** http://localhost:8080/v3/api-docs

### Key API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/auth/register` | ❌ | Register new user |
| `POST` | `/api/v1/auth/login` | ❌ | Login, returns JWT |
| `GET` | `/api/v1/auth/me` | ✅ | Current user info |
| `POST` | `/api/v1/profile/onboarding` | ✅ | Complete onboarding |
| `GET` | `/api/v1/jobs` | ❌ | List jobs |
| `POST` | `/api/v1/jobs/import` | ✅ | Import a job description |
| `GET` | `/api/v1/skills` | ❌ | List all skills |
| `GET` | `/api/v1/skills/graph` | ❌ | Skill graph (nodes + edges) |
| `GET` | `/api/v1/skill-gap/{role}` | ✅ | Skill gap analysis |
| `POST` | `/api/v1/resumes/upload` | ✅ | Upload resume (PDF/DOCX) |
| `GET` | `/api/v1/resumes/{id}/analysis` | ✅ | Resume analysis result |
| `GET` | `/api/v1/evidence` | ✅ | User evidence items |
| `POST` | `/api/v1/evidence` | ✅ | Add evidence |
| `GET` | `/api/v1/assessments` | ✅ | Available assessments |
| `GET` | `/api/v1/learning-plans/my` | ✅ | User learning plan |

---

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| Landing Page | ✅ Complete | Full sections, responsive, light/dark |
| Authentication (JWT) | ✅ Complete | Register, Login, Logout, `useAuth` hook |
| Onboarding Flow | ✅ Complete | 5-step, wired to backend with graceful fallback |
| Dashboard | ✅ Complete | Demo data with clear labeling |
| Job Intelligence | ✅ UI Complete | Import JD ✅, backend import endpoint ✅ |
| Skill Explorer | ✅ UI Complete | Canvas-based interactive graph with demo data |
| My Skills | ✅ UI Complete | Skill grid, evidence status |
| Resume Studio | ✅ UI Complete | File upload UI ✅, backend upload endpoint ✅ |
| Skill Gap Analysis | ✅ UI Complete | Radial chart, explainable gap items |
| Learning Roadmap | ✅ UI Complete | Phased accordion, task toggling |
| Evidence Portfolio | ✅ UI Complete | Evidence grid, add evidence dialog |
| Assessments | ✅ UI Complete | Assessment cards + attempt history |
| Settings | ✅ UI Complete | Profile, notifications, theme, security |
| Dark/Light Theme | ✅ Complete | Full design token system |
| Responsive Layout | ✅ Complete | Mobile sidebar, all pages |
| GitHub OAuth | ⏳ Stub | UI button present; backend OAuth not wired |
| AI/Gemini Analysis | ⏳ Stub | Architecture ready; API key not configured |
| Token Refresh | ⏳ Partial | Refresh tokens generated; endpoint not wired |
| PDF Export | ⏳ Not Started | UI placeholder only |

> **Demo data:** All charts, scores, and skill counts in the dashboard are clearly labeled as demo data. No live market data is fabricated as real.

---

## Design System

Vetra uses a coordinated multi-color design system defined in `frontend/src/styles/globals.css`.

### Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Midnight Navy | `#101828` | Dark backgrounds |
| Indigo | `#5146E5` | Brand, primary actions |
| Electric Violet | `#7958E8` | Secondary brand, gradients |

### Semantic Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Teal | `#0F9D8A` | Verified skills, positive progress |
| Amber | `#E9A23B` | Improvement opportunities, warnings |
| Coral | `#E87878` | Critical gaps, errors |
| Sky Blue | `#3296D8` | Information, analytics |

### Typography

- **Font:** Inter (system fallback: `-apple-system, sans-serif`)
- **Sizes:** Tailwind default scale

### Component Library

Extended shadcn/ui with Vetra-specific variants:
- **Button:** `default`, `gradient`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `teal`, `subtle`
- **Badge:** `default`, `secondary`, `destructive`, `outline`, `teal`, `amber`, `coral`, `info`, `muted`, `success`, `warning`

---

## Architecture

```
                    ┌─────────────────────────────┐
                    │       Nginx (port 80)        │
                    └──────────┬──────────────────-┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
     /static (React SPA)   /api/v1/*      /h2-console
              │                │
    ┌─────────▼──────┐  ┌──────▼──────────────────┐
    │  React + Vite  │  │  Spring Boot (port 8080) │
    │  (port 5173)   │  │                          │
    └────────────────┘  │  ┌────────────────────┐  │
                        │  │  Security (JWT)     │  │
                        │  ├────────────────────┤  │
                        │  │  identity           │  │
                        │  │  userprofile        │  │
                        │  │  jobintelligence    │  │
                        │  │  skillintelligence  │  │
                        │  │  skillgap           │  │
                        │  │  resumeintelligence │  │
                        │  │  evidence           │  │
                        │  │  assessment         │  │
                        │  │  learningroadmap    │  │
                        │  └─────────┬──────────┘  │
                        └────────────┼─────────────┘
                                     │
                        ┌────────────▼─────────────┐
                        │  H2 (local) / PostgreSQL  │
                        └───────────────────────────┘
```

**Domain boundaries** are enforced at the package level. DTOs never expose JPA entities directly. Cross-module calls go through service interfaces, not repositories.

---

## Running Tests

```powershell
cd backend
# Set JAVA_HOME and Maven on PATH first (see above)
mvn test -Dspring.profiles.active=local
```

Tests include:
- `JobServiceTest` — job import and skill extraction
- `SkillGapServiceTest` — gap classification logic
- `VetraApplicationTests` — Spring context load

---

*Built with care as a production-ready demonstration of evidence-based career intelligence.*
