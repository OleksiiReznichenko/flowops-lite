# Architecture

FlowOps Lite is a full-stack portfolio project built as a small operations platform for Norwegian SMBs.

The system is designed around three core workflows:

* Product and inventory management
* Customer management
* Order handling

The project is intentionally kept as a monorepo with a separate backend and frontend. The goal is not to build a huge SaaS product, but to show a realistic full-stack application with clear structure, business rules, authentication, database design, deployment, and basic CI/CD.

## System overview

```text
flowops-lite/
├── backend/             # ASP.NET Core backend
├── frontend/            # Next.js frontend
├── docs/                # Architecture and API documentation
├── .github/workflows/   # GitHub Actions workflows
├── docker-compose.yml   # Local development services
├── .editorconfig
├── .gitignore
├── LICENSE
└── README.md
```

## Tech stack

### Backend

* C#
* ASP.NET Core
* Entity Framework Core
* PostgreSQL
* ASP.NET Identity
* JWT authentication
* FluentValidation
* Serilog
* Swagger/OpenAPI
* xUnit

### Frontend

* Next.js App Router
* TypeScript
* Tailwind CSS
* CSS Modules
* Radix UI primitives
* TanStack Query
* Zustand
* Recharts

### Infrastructure

* Docker Compose for local PostgreSQL
* GitHub Actions for CI/CD
* Azure App Service for backend hosting
* Azure Database for PostgreSQL
* Vercel for frontend hosting
* Application Insights for logging and monitoring

## Backend architecture

The backend follows a clean architecture style.

```text
backend/
├── FlowOps.sln
├── src/
│   ├── FlowOps.Api/
│   ├── FlowOps.Application/
│   ├── FlowOps.Domain/
│   └── FlowOps.Infrastructure/
└── tests/
    ├── FlowOps.UnitTests/
    └── FlowOps.IntegrationTests/
```

### FlowOps.Domain

The domain project contains the core business model.

It should not depend on ASP.NET Core, Entity Framework Core, database code, or external services.

Typical contents:

* Entities
* Enums
* Value objects, if needed
* Domain exceptions
* Business rules

The most important domain logic is the order workflow.

Orders follow this state flow:

```text
Draft → Submitted → Fulfilled → Completed
            ↓
        Cancelled
```

The order entity should protect its own rules. For example, an order should not be submitted if it has no order lines, and a completed order should not be edited.

### FlowOps.Application

The application project coordinates use cases.

Typical contents:

* Services
* Interfaces
* DTO-related application models, if needed
* Application exceptions
* Business orchestration

This layer should handle workflows such as:

* Creating a customer
* Creating a product
* Submitting an order
* Updating stock when an order is submitted
* Writing audit log entries

The application layer should depend on the domain, but not directly on ASP.NET controllers.

### FlowOps.Infrastructure

The infrastructure project contains technical implementation details.

Typical contents:

* Entity Framework Core DbContext
* EF Core configurations
* Migrations
* Database seeding
* Repository implementations, if used
* Identity configuration
* JWT/refresh token implementation
* External service clients, such as Unsplash

This layer depends on the application and domain layers.

### FlowOps.Api

The API project is the entry point of the backend.

Typical contents:

* Controllers
* Request and response DTOs
* Validators
* Middleware
* Authentication and authorization setup
* Swagger/OpenAPI setup
* Program.cs

The API should not expose domain entities directly. Controllers should receive request DTOs and return response DTOs.

## Backend dependency direction

The dependency direction should stay one-way:

```text
Api → Application → Domain
Api → Infrastructure → Application → Domain
```

The domain layer stays independent.

The main rule:

> Business rules belong in the domain/application layers, not directly in controllers.

## Frontend architecture

The frontend uses the Next.js App Router and is organized by responsibility.

```text
frontend/src/
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   └── (app)/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── patterns/
│   └── features/
├── lib/
│   ├── api/
│   ├── hooks/
│   ├── stores/
│   ├── utils/
│   └── validations/
├── types/
└── styles/
```

### app/

Contains routes and route groups.

Planned route groups:

* `(marketing)` for the public landing page
* `(auth)` for login
* `(app)` for the protected application shell

### components/ui/

Small reusable UI primitives.

Examples:

* Button
* Input
* Select
* Dialog
* Table
* Badge
* StatusChip

These components should be generic and not tied to one feature.

### components/layout/

Layout-level components.

Examples:

* Sidebar
* TopBar
* AppShell
* PageHeader

### components/patterns/

Reusable page patterns.

Examples:

* ListPageTemplate
* DetailPageTemplate
* FormPageTemplate
* EmptyState

### components/features/

Feature-specific components.

Examples:

* products/ProductForm
* customers/CustomerDetails
* orders/OrderLinesTable
* dashboard/KpiCard

### lib/api/

Contains API client code.

Components should not call `fetch` directly. The expected data flow is:

```text
Component → hook → API module → API client → backend
```

### lib/hooks/

Contains TanStack Query hooks.

Examples:

* useProducts
* useProduct
* useCustomers
* useOrders
* useDashboardKpis

### lib/stores/

Contains Zustand stores for client-side state that is not server data.

Examples:

* auth store
* UI/sidebar state
* theme state

### lib/utils/

Contains formatting and utility helpers.

Examples:

* formatCurrency
* formatDate
* cn
* calculateVat, if needed on the frontend

Norwegian formatting should be used where relevant:

* Currency: `12 450,50 NOK`
* Date: `25.04.2026`
* VAT: 25%

## Database design

The database uses PostgreSQL.

Planned core tables:

* users / identity tables
* customers
* products
* orders
* order_lines
* audit_log_entries
* refresh tokens, if stored separately

Main design choices:

* UUID primary keys
* Unique SKU/article number for products
* Unique email where appropriate
* Order line unit prices are snapshotted
* Order status timestamps are stored directly on the order
* Audit log details are stored as JSONB
* Soft delete/archive is used where historical data should be preserved

Order line prices are snapshotted so historical orders do not change if a product price is updated later.

## Authentication and authorization

The app uses ASP.NET Identity with JWT authentication.

Planned roles:

* Admin
* Standard

Admin users can access everything, including audit logs and user management.

Standard users can work with products, customers, and orders, but should not access admin-only areas.

The frontend should handle expired access tokens by calling the refresh endpoint and retrying the original request.

## External integration

The project uses one external integration: Unsplash.

The planned use case is product image lookup by product name.

The integration should be wrapped behind an application/infrastructure service so the rest of the system does not depend directly on Unsplash-specific code.

If the Unsplash request fails, the product feature should still work without an image.

## Deployment architecture

Planned deployment:

```text
Frontend: Vercel
Backend: Azure App Service
Database: Azure Database for PostgreSQL
Monitoring: Application Insights
```

Local development uses Docker Compose for PostgreSQL.

## Scope boundaries

The project intentionally does not include:

* Invoicing
* Payments
* Suppliers
* Purchase orders
* Multi-tenancy
* Multi-warehouse inventory
* Email notifications
* Background jobs
* Microservices
* GraphQL
* Redis
* Kubernetes
* Real-time features

New ideas should go into a future roadmap instead of being added to the current scope.

## Architecture principle

The project should stay boring in the right places.

The goal is not to show every possible technology. The goal is to show that a full-stack business application can be structured, tested, documented, deployed, and maintained.
