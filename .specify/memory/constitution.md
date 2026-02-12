<!-- SYNC IMPACT REPORT
Version change: 1.0.0 → 1.1.0
Modified principles: None (new constitution)
Added sections: Core Principles (6), Standards, Technology Constraints, Process Constraints, Security Requirements, Quality Standards, Success Criteria
Removed sections: None
Templates requiring updates: 
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated  
- .specify/templates/tasks-template.md ✅ updated
- .specify/templates/commands/*.md ⚠ pending review
- README.md ⚠ pending review
Follow-up TODOs: None
-->
# Phase II – Todo Full-Stack Web Application Constitution

## Core Principles

### Spec-First Development
All implementation must follow an approved specification; no coding without a corresponding spec document in /specs; Specifications must detail requirements, interfaces, and acceptance criteria before any implementation begins.

### Agentic Workflow
Clear separation of agent roles and responsibilities; Each agent performs specific functions (planning, implementation, testing) without overlap; Agents must acknowledge skills and limitations before taking action.

### Security by Design
JWT-based authentication required on all API endpoints; Strict user isolation enforced at both API and database levels; Security considerations integrated from initial design through implementation.

### Deterministic Behavior
No assumptions or hidden logic in the codebase; All functionality must be explicitly defined and documented; Predictable behavior regardless of environment or user context.

### Reviewability
All decisions must be traceable to specifications and prompts; Code changes must reference specific specs using @specs/... notation; Complete audit trail maintained for all implementations.

### Statelessness
Frontend and backend must remain statelessly coupled via JWT; No server-side session storage; All state managed through authentication tokens and API interactions.

## Standards

### Specification Standards
All features must be defined in /specs before implementation; Specifications must include acceptance criteria, error handling, and security requirements; All implementation steps must reference specs using @specs/... notation.

### Implementation Standards
Authentication is mandatory on all API endpoints; User identity must be derived from JWT, never from request parameters; Task ownership must be enforced at API and database levels; No cross-user data access under any circumstance.

### Quality Standards
REST APIs must be consistent and predictable; Error handling must use HTTP status codes and clear messages; Database schema must include indexes for user-based filtering; Frontend must use a centralized API client; No duplicated logic across layers.

## Technology Constraints

### Stack Requirements
Frontend: Next.js 16+ (App Router), TypeScript, Tailwind CSS; Backend: Python FastAPI; ORM: SQLModel; Database: Neon Serverless PostgreSQL; Authentication: Better Auth (frontend) + JWT verification (backend).

### Architecture Requirements
Architecture: Monorepo with layered CLAUDE.md files; Development mode: Claude Code + Spec-Kit Plus only (no manual coding); All components must adhere to the defined technology stack without deviation.

## Process Constraints

### Development Flow
Development flow must follow: Write/Update Spec → Generate Plan → Break into Tasks → Implement → Test; Claude Code must not write production code before: Agent initialization, Skill acknowledgment, Explicit implementation request.

### Requirement Handling
Any requirement ambiguity must result in a spec update, not a guess; Console-app assumptions from Phase I must not leak into Phase II; All decisions must be justified with reference to specifications.

## Security Requirements

### Authentication & Authorization
JWT must be validated on every backend request; Shared secret must be provided via BETTER_AUTH_SECRET environment variable; Requests without valid JWT must return 401 Unauthorized.

### Data Isolation
Backend must filter all data by authenticated user ID; No trust in client-provided user identifiers; User data must be isolated at both API and database levels; Authentication must be verified before any data access.

## Success Criteria

### Feature Implementation
All Phase II features implemented exactly as defined in specs; End-to-end flow works for multiple users with full isolation; All API endpoints are protected by JWT authentication.

### Consistency
Specs, plans, prompts, and implementation are internally consistent; Claude Code adheres strictly to agent roles and spec boundaries; All components work together seamlessly.

## Governance

Constitution supersedes all other development practices; Amendments require documentation of rationale and impact assessment; All development activities must verify compliance with these principles; Code reviews must validate constitutional adherence.

**Version**: 1.1.0 | **Ratified**: 2026-02-03 | **Last Amended**: 2026-02-03s