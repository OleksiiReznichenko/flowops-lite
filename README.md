
# FlowOps Lite

FlowOps Lite is a personal full-stack project I'm building to get more hands-on experience with C#, ASP.NET Core, databases and modern application development.

The idea is to create a small operations platform where businesses can manage products, inventory, customers and orders.

## Project status

**Early development - work in progress.**

The project is currently focused on setting up the development environment, application structure and basic tooling.

The repository includes:

- Backend and frontend project structure
- PostgreSQL configuration with Docker Compose
- Initial GitHub Actions workflow files
- Architecture and development documentation

Core business features are not implemented yet.

## Technology choices

The main technologies selected for the project are:

**Backend**
- C#
- ASP.NET Core
- PostgreSQL

**Frontend**
- Next.js
- TypeScript

**Development tools**
- Docker and Docker Compose
- Git and GitHub Actions

Other technologies, including Entity Framework Core, authentication, automated backend testing and Azure services, are part of the planned development work.

## Planned features

- Product and inventory management
- Customer management
- Order processing
- Dashboard with basic statistics
- Authentication and user roles
- Audit logging
- Norwegian currency, date and VAT formatting

These features are part of the project plan and shouldn't be considered implemented functionality.

## Repository structure

```text
flowops-lite/
├── backend/          # ASP.NET Core backend
├── frontend/         # Next.js frontend
├── docs/             # Architecture and technical documentation
├── .github/workflows/
├── docker-compose.yml
└── README.md
```

## Development

I'm building this project gradually while studying Information Technology at OsloMet.

The main goal is to gain experience with backend architecture, APIs, database design, testing and deployment, rather than just putting together another frontend.

I'll update this README as working features are added.
