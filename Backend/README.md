# CompetiLens AI Backend

Enterprise-grade competitive intelligence engine backend foundation.

## Tech Stack

- **Node.js** & **Express.js** (Web application framework)
- **TypeScript** (Language configuration using ES2022 and NodeNext)
- **Prisma ORM** (Database mapping layer)
- **PostgreSQL** via **Neon** (Serverless relational database hosting)
- **Helmet**, **CORS**, & **Express Rate Limit** (Network and application-level security)
- **Compression** & **Cookie Parser** (Payload optimizations)
- **Morgan** (Development logger)

---

## Folder Structure

```text
Backend/
│
├── prisma/
│   └── schema.prisma        # Prisma Database Schema definitions
│
├── src/
│   ├── config/              # Global configurations (e.g. database client, env wrappers)
│   ├── controllers/         # HTTP request controllers handling incoming actions
│   ├── routes/              # Express Router definitions
│   ├── middleware/          # Security filters, error loggers and request checkers
│   ├── services/            # Core business workflows and external AI handshakes
│   ├── repositories/        # Database query layers using Prisma client
│   ├── validators/          # Input schema validations (e.g. Zod or Joi schemas)
│   ├── models/              # Schema classes and database type representations
│   ├── interfaces/          # Standard TS interfaces
│   ├── types/               # Custom TS declaration types
│   ├── helpers/             # Standard helper routines
│   ├── utils/               # App utilities (e.g. encryption, formats)
│   ├── constants/           # Global fixed configuration tokens
│   ├── jobs/                # Background chron task scheduling
│   ├── sockets/             # Realtime WebSocket event gateways
│   ├── docs/                # OpenAPI or Swagger documentation layouts
│   ├── app.ts               # Express pipeline definition
│   └── server.ts            # Entrypoint listener bootstrap
│
├── uploads/                 # Temporary static uploads directory
├── logs/                    # Local diagnostic system logfiles
├── tests/                   # Jest or Vitest test suites
│
├── .env                     # Server environment variables
├── .env.example             # Public template mapping environment configs
├── .gitignore               # Ignored versioning paths
├── package.json             # NPM package scripts and dependencies
├── tsconfig.json            # Strict TypeScript configuration
├── nodemon.json             # Nodemon auto-reload config
└── README.md                # Project documentation overview
```

---

## Getting Started

### 1. Prerequisite Installations

Ensure you have **Node.js** (v18+) and **npm** installed locally.

### 2. Configure Environment Variables

Create a local `.env` configuration file based on `.env.example`:

```bash
cp .env.example .env
```

Define the local variables:

- `PORT`: Server Port (defaults to `5000`)
- `NODE_ENV`: Current environment mode (`development` or `production`)
- `DATABASE_URL`: Connection string to your serverless Neon PostgreSQL instance

### 3. Generate Database Client

Generate the database mappings using the Prisma Client generator:

```bash
npm run prisma:generate
```

### 4. Running the Server

#### Start Development Mode (Auto reloading)

```bash
npm run dev
```

#### Build for Production

Compile the TypeScript files to modern JavaScript under the `dist/` directory:

```bash
npm run build
```

#### Start Production Server

Ensure build output files exist, then boot the server:

```bash
npm run start
```

---

## Core Endpoints

### Health Check

- **Route:** `GET /`
- **Response Format:**
  ```json
  {
    "success": true,
    "message": "CompetiLens AI Backend Running",
    "version": "1.0.0"
  }
  ```
