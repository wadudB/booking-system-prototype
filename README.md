# Hospital Booking System Prototype

A simplified mobile-focused booking system prototype built with Next.js, Prisma, and TypeScript.

## Features

- User authentication (email/password)
- Display a list of hospitals and their services
- Ability to select a hospital's service and book an appointment
- View bookings

## Tech Stack

- **Frontend**: Next.js (App Router), React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js 22+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
npm run db:generate
npm run db:push
```

4. Seed the database with initial data:

```bash
npm run db:seed
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Overview

The system provides RESTful API endpoints for authentication, hospitals, services, and bookings.

For detailed API documentation, please see [API-DOCUMENTATION.md](./API-DOCUMENTATION.md).

## Test User

The seed script creates a test user:

- Email: test@example.com
- Password: password123

## Project Structure

- `/app` - Next.js App Router pages and layouts
- `/app/api` - API Routes for the backend
- `/prisma` - Prisma schema and database configuration

## Design Decisions

### Technical Choices

- **Next.js (App Router)**: 
  - Unified frontend and backend to reduce complexity
  - Server Components for improved performance and SEO
  - API Routes for a seamless full-stack experience

- **Prisma ORM**:
  - Type-safe database access
  - Auto-generated client based on schema
  - Migration management
  - SQLite for simplicity in development (can be easily switched to PostgreSQL for production)

- **NextAuth.js**:
  - Simplified authentication flow
  - Secure JWT-based sessions
  - Extensible for future authentication methods
  - Integration with Prisma for user storage

## Assumpations Made

- **User Authentication**: Users need to be authenticated to manage bookings but not to view hospital/services
- **Booking Workflow**: Simple booking flow without payment integration..
- **Hospital Services**: Each hospital offers multiple services with fixed durations
- **Booking States**: Bookings can be in pending, confirmed, or cancelled states
