# Verdict 360 - AI Chatbot SaaS Platform

A multi-tenant SaaS platform providing AI chatbots to law firms across South Africa. Each law firm gets a customized chatbot that helps their website visitors get basic legal information and book free consultations.

## Features

- **Multi-tenant Architecture**: Secure data isolation between law firms
- **AI-powered Chatbots**: Llama 3.1/3.2 based legal assistance
- **Admin Dashboard**: Revenue tracking, client management, platform analytics
- **Law Firm Dashboard**: Lead management, analytics, calendar integration
- **White-label Solution**: Customizable branding per law firm
- **Subscription Management**: Stripe integration for billing
- **Calendar Integration**: Google Calendar sync for consultation bookings

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Redis 6+
- Ollama (for AI model)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd verdict360-lite
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
npm run db:migrate
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at:
- Server: http://localhost:3000
- Client: http://localhost:3001

## Project Structure

```
verdict360-lite/
├── src/
│   ├── server/          # Backend API
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   ├── utils/       # Utility functions
│   │   ├── config/      # Configuration files
│   │   └── database/    # Migrations and seeds
│   ├── client/          # Frontend application
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── utils/       # Utility functions
│   │   ├── contexts/    # React contexts
│   │   └── assets/      # Static assets
│   └── shared/          # Shared code between client/server
├── tests/               # Test files
├── docs/                # Documentation
└── logs/                # Application logs
```

## Development

### Available Scripts

- `npm run dev` - Start development server (both client and server)
- `npm run server:dev` - Start server in development mode
- `npm run client:dev` - Start client in development mode
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run typecheck` - Run TypeScript type checking

### Database Commands

- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:rollback` - Rollback last migration

## Multi-Tenant Architecture

Each law firm is a separate tenant with:
- Isolated data and configurations
- Custom subdomain (firm.verdict360.com)
- Branded chatbot interface
- Individual analytics and dashboards

## AI Integration

The platform uses Ollama with Llama 3.1/3.2 models for:
- South African legal question answering
- Conversation flow management
- Lead qualification and consultation booking

## API Documentation

API documentation is available at `/api/docs` when running in development mode.

## Deployment

### Environment Setup

1. Set up PostgreSQL database
2. Configure Redis instance
3. Set up Ollama with Llama model
4. Configure environment variables for production

### Production Build

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For technical support or questions:
- Documentation: `/docs`
- Issues: Create an issue in the repository
- Email: support@verdict360.com