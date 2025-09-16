# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application (includes Prisma client generation)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Testing
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Database
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Sync schema to database
- `npx prisma studio` - Open database browser (optional)

### AI Assistant Integration
- `npm run bmad:refresh` - Install/update AI assistant methods
- `npm run bmad:list` - List available AI assistants
- `npm run bmad:validate` - Validate AI assistant configuration

## Architecture Overview

### Clean Architecture Pattern
This project follows a strict layered architecture:

- **Transport Layer** (`src/app/api/`) - HTTP route handlers only
- **Service Layer** (`src/server/services/`) - Business logic and rules
- **Repository Layer** (`src/server/repositories/`) - Data access via Prisma
- **Contracts Layer** (`src/server/contracts/`) - Shared DTOs and validation schemas

### Key Architectural Decisions
1. **JWT-based Authentication**: HTTP-only cookies, 7-day expiration, automatic renewal
2. **Standardized API Responses**: Consistent envelope pattern with success/error handling
3. **Server-First Components**: Minimal client-side JavaScript, SSR where possible
4. **Type Safety**: TypeScript strict mode with comprehensive validation using Zod
5. **Testability**: Vitest with environment-specific testing (JSDOM for components, Node.js for services)

### Database Schema
The application uses PostgreSQL with these core entities:
- **User**: Authentication and profile data
- **Trip**: Trip management with metadata and user ownership
- **BorderBuddy**: AI assistant instance (one per trip)
- **BorderBuddyContext**: User preferences and trip context
- **PlacesRecommendation**: AI-generated place suggestions
- **ChatMessage**: Conversational history with AI

## Development Patterns

### API Development
1. Create DTOs and validation schemas in `src/server/contracts/`
2. Implement repositories in `src/server/repositories/`
3. Create services in `src/server/services/`
4. Build API routes in `src/app/api/` using the standardized response envelope
5. Test with both unit and integration tests

### Component Development
1. Use server components by default
2. Implement props interfaces for type safety
3. Follow the shadcn/ui pattern for base components
4. Use Tailwind CSS with consistent theming
5. Ensure accessibility with ARIA labels and focus management

### Authentication Flow
- Authentication is handled via HTTP-only cookies
- Route protection uses edge middleware (`src/middleware.ts`)
- Service layers verify ownership (e.g., `trip.userId !== userId`)
- Current user detection via `src/lib/auth.ts`

### Error Handling
- Services return typed results (`{ ok: boolean, ... }`)
- Route handlers map service errors to HTTP status codes
- Use standardized error codes from `src/lib/api.ts`
- Implement graceful degradation for external dependencies

## Testing Guidelines

### Test Organization
- Place tests in `__tests__/` directories alongside implementation files
- Use JSDOM environment for component tests
- Use Node.js environment for server-side tests
- Mock all external dependencies (DB, APIs, services)

### Testing Patterns
```typescript
// Service tests
describe('ServiceName', () => {
  it('should handle success case', async () => {
    // Mock repository dependencies
    // Test business logic
  })
})

// API route tests
describe('API Route', () => {
  it('should return 200 for valid request', async () => {
    // Test HTTP layer
  })
})
```

## BorderBuddy AI Integration

### LLM Service Architecture
- Abstraction layer over OpenAI API
- Support for both streaming and non-streaming responses
- Retry logic with exponential backoff
- Graceful fallback when API unavailable

### Chat Service Patterns
- Message persistence with conversation history
- Streaming responses for real-time UX
- System prompts with context awareness
- Event-driven streaming with SSE-like patterns

## Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing
- `OPENAI_API_KEY` - OpenAI API integration

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (protected)/       # Protected route wrapper
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── ...
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   └── ...               # Feature-specific components
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts             # Database connection
│   ├── api.ts            # API response helpers
│   └── ...
├── server/               # Server-side services
│   ├── config/           # Server configuration
│   ├── contracts/        # DTOs and validation schemas
│   ├── middleware/       # Server middleware
│   ├── repositories/     # Data access layer
│   └── services/         # Business logic layer
└── types/               # TypeScript type definitions
```

## Key Dependencies

### Core Stack
- Next.js 15.5.2 with App Router and Turbopack
- TypeScript 5.x with strict mode
- PostgreSQL with Prisma ORM 6.15.0
- Tailwind CSS 4.x with custom theming

### Development Tools
- Vitest for testing with coverage support
- ESLint with Next.js configuration
- Prisma for database management and migrations

### AI Integration
- OpenAI API for chat and place recommendations
- Custom LLM abstraction layer
- Streaming response handling

## Documentation

Comprehensive documentation is available in the `docs/` directory:
- Architecture Decision Records (ADRs)
- Product requirements and specifications
- User stories and implementation details
- Testing and quality assurance plans

When implementing new features, refer to the existing patterns and documentation to maintain consistency with the established architecture.