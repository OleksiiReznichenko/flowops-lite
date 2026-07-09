# FlowOps Lite

FlowOps Lite is a full-stack portfolio project built to explore modern business software development with .NET, PostgreSQL, Azure, Next.js, and TypeScript.

The project is designed as a small operations platform for Norwegian SMBs that need a simple way to manage products, inventory, customers, and orders.

## Project status

Early development.

Current phase:

- [ ] Initial repository setup
- [ ] Local PostgreSQL setup with Docker
- [ ] Backend solution setup
- [ ] Frontend app setup
- [ ] Basic CI workflows

## Tech stack

### Backend

- C#
- ASP.NET Core
- Entity Framework Core
- PostgreSQL
- ASP.NET Identity
- JWT authentication
- FluentValidation
- Serilog
- xUnit

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- CSS Modules
- Radix UI primitives
- TanStack Query
- Zustand
- Recharts

### Infrastructure

- Docker
- GitHub Actions
- Azure App Service
- Azure Database for PostgreSQL
- Vercel

## Planned features

- Product and inventory management
- Customer management
- Order workflow
- Dashboard with KPIs
- Audit log
- Admin and standard user roles
- Norwegian currency, date, and VAT formatting

## Repository structure

```text
flowops-lite/
├── backend/             # ASP.NET Core backend
├── frontend/            # Next.js frontend
├── docs/                # Architecture and project documentation
├── .github/workflows/   # CI/CD workflows
├── docker-compose.yml   # Local development services
├── .editorconfig
├── .gitignore
├── LICENSE
└── README.md