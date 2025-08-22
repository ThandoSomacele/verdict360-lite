# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `npm run dev` - Start both client and server in development mode (client on :3001, server on :3000)
- `npm run server:dev` - Start only the backend server with nodemon
- `npm run client:dev` - Start only the React frontend
- `npm run build` - Build both client and server for production
- `npm run start` - Start production server from dist/

### Database Operations
- `npm run db:migrate` - Run pending Knex migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:rollback` - Rollback the last migration batch

### Code Quality
- `npm run lint` - Run ESLint on src/ directory
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run typecheck` - Run TypeScript type checking without emitting files
- `npm run test` - Run Jest test suite
- `npm run test:watch` - Run tests in watch mode

## Architecture Overview

### Multi-Tenant SaaS Platform
This is a multi-tenant SaaS platform for AI chatbots serving South African law firms. Each law firm is an isolated tenant with:

- **Data Isolation**: Separate database schemas/namespaces per tenant
- **Custom Branding**: White-label chatbot interfaces
- **Subdomain Routing**: Each firm gets `firm.verdict360.com`
- **Individual Analytics**: Per-tenant dashboards and metrics

### Core Technology Stack
- **Framework**: SvelteKit 2.0 for full-stack development
- **Backend**: Express.js with PostgreSQL (Knex.js ORM) and Redis caching
- **Frontend**: Svelte 5 with Tailwind CSS (migrated from React)
- **AI Integration**: Ollama with Llama 3.1/3.2 models for South African legal assistance
- **Real-time**: Socket.io for chat functionality
- **Billing**: Stripe integration for subscription management
- **Authentication**: JWT with refresh tokens
- **Email**: Nodemailer for notifications and calendar invites

### Key Integration Points
- **Calendar Sync**: Google Calendar API for consultation booking
- **Rate Limiting**: rate-limiter-flexible for API protection
- **File Uploads**: Multer with configurable storage
- **Logging**: Winston for structured logging
- **Validation**: Joi for request/response validation

### Application Structure
- **src/sveltekit/**: SvelteKit application
  - `routes/`: Page components and API endpoints
    - `[tenant]/`: Dynamic tenant routes for multi-tenant support
    - `admin/`: Admin dashboard pages
    - `api/`: API endpoints for backend services
  - `lib/`: Shared libraries and utilities
    - `components/`: Reusable Svelte components
    - `server/`: Server-side utilities and database connections
    - `services/`: Business services (AI, email, calendar, billing)
  - `hooks.server.ts`: Server hooks for authentication and tenant resolution
  - `app.html`: Application HTML template
  - `app.css`: Global styles with Tailwind CSS
- **src/server/**: Legacy Express.js backend (being migrated)
  - `database/`: Knex migrations and seeds
  - `config/`: Database and service configurations

### Environment Configuration
The application requires extensive environment configuration for:
- Database connections (PostgreSQL)
- Redis caching
- AI model endpoints (Ollama)
- Third-party integrations (Stripe, Google Calendar, email SMTP)
- Multi-tenant settings (domain suffix, default tenant)
- Security tokens and secrets

### Development Workflow
1. Set up local PostgreSQL and Redis instances
2. Copy `.env.example` to `.env` and configure
3. Run `npm run db:migrate && npm run db:seed` for database setup
4. Use `npm run dev` to start the SvelteKit development server on port 3000
5. Always run `npm run lint && npm run typecheck` before commits
6. Run `npm run check` to validate SvelteKit configuration

### Multi-Tenant Considerations
When working with this codebase:
- All database queries must include tenant context
- API routes should resolve tenant from subdomain or header
- Frontend components should support tenant-specific branding
- Services (AI, email, calendar) must be tenant-aware
- Analytics and metrics collection must segregate by tenant
- dont add claude in commit messages

## Visual Development

## Design Principles
- Comprehensive design checklist in `/context/design-principles.md`
- Brand style guide in `/context/style-guide.md`
- Design review agent configuration in `/context/design-review-agent.md`
- When making visual (front-end, UI/UX) changes, always refer to these files for guidance

### Quick Visual Check
IMMEDIATELY after implementing any front-end change:
1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use `mcp_playwright_browser_navigate` to visit each changed view
3. **Verify design compliance** - Compare against `/context/design-principles.md` and `/context/style-guide.md`
4. **Validate feature implementation** - Ensure the change fulfills the user's specific request
5. **Check acceptance criteria** - Review any provided context or requirements
6. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view
7. **Check for errors** - Run `mcp_playwright_browser_console_messages`

This verification ensures changes meet design standards and user requirements.

### Comprehensive Design Review
Invoke the `@agent-design-review` subagent for thorough design validation when:
- Completing significant UI/UX features
- Before finalizing PRs with visual changes
- Needing comprehensive accessibility and responsiveness testing

### shadcn/ui Components
- Modern component library built on Radix UI primitives
- Tailwind CSS v4 with CSS variables for theming
- Lucide icons throughout

### Key Features

- Dashboard for event management
- Content moderation tools
- Export functionality
- Credits system
- Multi-tenant architecture with organization support

### Git Commit Guidelines

- Please use Conventional Commits formatting for git commits.
- Please use Conventional Branch naming (prefix-based branch naming convention)
- Please do not mention yourself (Claude) as a co-author when committing, or include any links to Claude Code

### Guidance Memories

- Please ask for clarification upfront, upon the initial prompts, when you need more direction.

### Linting and Code Quality

- Please run `npm run lint` after completing large additions or refactors to ensure adherence to syntactic best practices

### CLI Tooling Memories

- Please use the `gh` CLI tool when appropriate, create issues, open pull requests, read comments, etc.
