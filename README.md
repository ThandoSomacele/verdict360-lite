# Verdict 360 - AI Legal Chatbot SaaS Platform

A modern multi-tenant SaaS platform providing AI-powered legal chatbots to South African law firms. Built with SvelteKit 5, featuring real-time WebSocket communication and comprehensive multi-tenancy.

## ✨ Features

- **🏢 Multi-tenant Architecture**: Secure data isolation with tenant-based routing
- **🤖 AI-Powered Chat**: Llama 3.1/3.2 based legal assistance with real-time WebSocket communication
- **📊 Admin Dashboard**: Revenue tracking, tenant management, platform analytics
- **⚖️ Law Firm Dashboard**: Lead management, conversation analytics, calendar integration
- **🎨 White-label Solution**: Customizable branding per law firm
- **💳 Subscription Management**: Stripe integration for billing and payments
- **📅 Calendar Integration**: Google Calendar sync for consultation bookings
- **🔄 Real-time Updates**: Socket.io for instant bi-directional communication

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Redis 6+ (optional, for caching)
- Ollama with Llama 3.1/3.2 (for AI responses)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd verdict360-lite
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your database, Redis, and API configurations
```

4. **Set up the database:**
```bash
npm run db:migrate
npm run db:seed
```

5. **Start the development server:**
```bash
npm run dev
```

The application will be available at **http://localhost:3000**

## 📁 Project Structure

```
verdict360-lite/
├── src/
│   ├── lib/
│   │   ├── components/       # Svelte 5 components
│   │   ├── server/          # Server-side code
│   │   │   ├── config/      # Database & service configs
│   │   │   ├── database/    # Migrations & seeds
│   │   │   └── socket.ts    # Socket.io logic
│   │   ├── services/        # Business logic services
│   │   └── utils/           # Shared utilities
│   ├── routes/              # SvelteKit routes & API endpoints
│   │   ├── api/            # API routes
│   │   ├── admin/          # Admin dashboard
│   │   └── dashboard/      # Law firm dashboard
│   └── app.html            # HTML template
├── server.js                # Custom Node.js server with Socket.io
├── scripts/                 # Utility scripts
├── docs/                    # Documentation
│   ├── guides/             # Active guides
│   └── archive/            # Historical docs
└── docker/                  # Docker configs (legacy)
```

## 🛠️ Development

### Available Scripts

**Development:**
- `npm run dev` - Start SvelteKit dev server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run start` - Start production server (custom Node.js + Socket.io)

**Code Quality:**
- `npm run check` - Run Svelte/TypeScript checks
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking

**Database:**
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:rollback` - Rollback last migration
- `npm run db:setup` - Run migrations and seeds

**Tenant Management:**
- `npm run tenant:add` - Add a new tenant (interactive)
- `npm run tenant:list` - List all tenants

## 🏗️ Architecture

### Multi-Tenant System
Each law firm is an isolated tenant with:
- Custom subdomain (`firm.verdict360.com`)
- Isolated database records with tenant_id filtering
- Branded chatbot interface
- Individual analytics dashboards
- Separate billing and subscription

### Real-time Communication
- **WebSocket-first**: Socket.io for real-time chat
- **HTTP fallback**: Automatic fallback for reliability
- **Tenant isolation**: Socket.io rooms per tenant
- **Auto-reconnection**: Built-in reconnection logic

### Technology Stack
- **Framework**: SvelteKit 2 with Svelte 5 (runes)
- **Server**: Custom Node.js with Express + Socket.io
- **Database**: PostgreSQL with Knex.js
- **Caching**: Redis (optional)
- **AI**: Ollama (Llama 3.1/3.2)
- **Styling**: Tailwind CSS v3
- **Icons**: Lucide Svelte
- **Type Safety**: TypeScript

## 📡 API Structure

### SvelteKit API Routes
- `/api/chat` - Chat message handling (HTTP fallback)
- `/api/leads` - Lead capture and management
- `/api/tenants/*` - Tenant management
- `/api/admin/*` - Admin operations
- `/api/ai/*` - AI service endpoints

### WebSocket Events
```typescript
// Client → Server
socket.emit('join-tenant', tenantId)
socket.emit('chat-message', { message, tenantId, conversationHistory })
socket.emit('submit-contact', { contactInfo, tenantId })

// Server → Client
socket.on('ai-response', (message) => { /* Handle response */ })
socket.on('typing', ({ isTyping, sender }) => { /* Show indicator */ })
socket.on('contact-submitted', ({ success, message }) => { /* Handle result */ })
```

## 🚀 Deployment

### VPS Deployment with Coolify

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for comprehensive deployment instructions including:
- Coolify configuration
- Environment variables
- Database setup
- WebSocket configuration
- SSL/Domain setup

**Quick Deploy:**
```bash
# Build
npm run build

# Start production server
npm run start
```

The application uses `@sveltejs/adapter-node` for VPS compatibility with full WebSocket support.

## 🔐 Environment Variables

Key environment variables (see `.env.example` for complete list):

```bash
# App
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/verdict360

# AI
AI_MODEL=llama3.1
AI_ENDPOINT=http://localhost:11434

# Authentication
JWT_SECRET=your_secret_key

# Stripe (optional)
STRIPE_SECRET_KEY=sk_...
```

## 📚 Documentation

- **[Deployment Guide](./DEPLOYMENT.md)** - VPS/Coolify deployment
- **[Quick Start](./docs/guides/QUICK_START.md)** - Getting started guide
- **[CLAUDE.md](./CLAUDE.md)** - AI assistant instructions
- **[Documentation Index](./docs/README.md)** - All documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using Conventional Commits
4. Run linting: `npm run lint && npm run check`
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Standards
- **Svelte 5**: Use runes (`$state`, `$derived`, `$effect`, `$props`)
- **TypeScript**: Full type safety
- **Formatting**: Prettier with Svelte plugin
- **Commits**: Conventional Commits format

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details

## 💬 Support

- **Documentation**: [/docs](./docs)
- **Issues**: [GitHub Issues](https://github.com/your-org/verdict360-lite/issues)
- **Email**: support@verdict360.com

## 🎯 Project Status

**Current Version**: 2.0.0 (SvelteKit Edition)

**Recent Updates:**
- ✅ Migrated to Svelte 5 with runes
- ✅ WebSocket support restored for VPS deployment
- ✅ Removed legacy Express server code
- ✅ Optimized for Coolify deployment
- ✅ Full multi-tenant isolation

---

**Built with** ❤️ **for South African law firms**
