# 786Bet Casino Platform

## Overview
786Bet is a modern casino platform built with React + Vite frontend and Express.js backend, featuring a sophisticated Aviator crash game. The application follows a clean, modular architecture with separate client and server directories, shared schemas, and a comprehensive UI component system built with shadcn/ui and Tailwind CSS.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom casino-themed design system
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **State Management**: TanStack Query for server state, React hooks for local state
- **Type Safety**: TypeScript throughout with strict configuration

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with validation using Zod schemas
- **Authentication**: Session-based authentication with role-based access control

### Database Design
The application uses PostgreSQL with the following core entities:
- **Users**: User accounts with balance, referral system, and role management
- **Games**: Individual game sessions with bet amounts, multipliers, and outcomes
- **Withdrawals/Deposits**: Financial transaction tracking with approval workflows
- **Chat Messages**: Real-time chat system for the game room
- **Game Settings**: Admin-configurable game parameters (RTP, multipliers, etc.)

## Key Components

### Game Engine
- **Aviator Game**: Real-time crash game with dynamic multiplier calculation
- **Betting System**: Support for manual and auto-cashout functionality
- **Live Chat**: Real-time messaging system for player interaction
- **Admin Controls**: Game settings management and player oversight

### User Management
- **Authentication**: Email/password login with session management
- **User Dashboard**: Balance tracking, game history, and referral management
- **Admin Panel**: User management, financial oversight, and game control
- **Referral System**: Multi-level referral tracking with earnings calculation

### Financial System
- **Wallet Management**: Real-time balance updates and transaction tracking
- **Deposit/Withdrawal**: Multi-method payment processing with admin approval
- **Transaction History**: Comprehensive audit trail for all financial operations

## Data Flow

### Game Flow
1. User places bet with optional auto-cashout multiplier
2. Game engine starts multiplier calculation with random crash point
3. User can manually cash out or auto-cashout triggers
4. Game resolves with payout calculation and balance update
5. Transaction recorded in database with audit trail

### Authentication Flow
1. User credentials validated against database
2. Session created and stored in PostgreSQL
3. Session ID returned to client as secure cookie
4. Subsequent requests authenticated via session lookup
5. Role-based access control enforced on protected routes

### Admin Operations
1. Admin users access control panel with enhanced permissions
2. Real-time monitoring of user activities and game statistics
3. Financial transaction approval/rejection workflows
4. Game parameter adjustments with immediate effect

## External Dependencies

### Frontend Dependencies
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing solution
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **date-fns**: Date manipulation and formatting
- **class-variance-authority**: Type-safe component variants

### Backend Dependencies
- **drizzle-orm**: Type-safe database operations
- **@neondatabase/serverless**: PostgreSQL database connection
- **express-session**: Session management middleware
- **connect-pg-simple**: PostgreSQL session store
- **zod**: Runtime type validation and schema parsing

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Static type checking
- **esbuild**: Fast JavaScript bundler for production
- **drizzle-kit**: Database migration and schema management

## Deployment Strategy

### Development Environment
- Vite development server with HMR for frontend
- Express server with TypeScript compilation via tsx
- Replit integration with development banner and cartographer plugin
- Environment-based configuration with DATABASE_URL

### Production Build
1. Frontend built using Vite to static assets in `dist/public`
2. Backend compiled using esbuild to ESM bundle in `dist/index.js`
3. Database migrations applied using `drizzle-kit push`
4. Static file serving handled by Express in production mode

### Database Configuration
- PostgreSQL database required with connection via DATABASE_URL
- Drizzle ORM handles schema management and migrations
- Session storage configured for PostgreSQL with connect-pg-simple
- Schema validation ensures data integrity across all operations

### Security Considerations
- Session-based authentication with secure cookie configuration
- SQL injection prevention through parameterized queries
- Input validation using Zod schemas on all endpoints
- Role-based access control for admin functionality
- CORS and security headers configured for production deployment