# Git Workflow for FlowOps Lite

This document explains the Git system used for FlowOps Lite.

The goal is not to create a complicated enterprise workflow. The goal is to keep the project history clean, understandable, and professional while still being simple enough to follow during solo development.

FlowOps Lite is a monorepo with a Next.js frontend, an ASP.NET Core backend, documentation, Docker setup, and later CI/CD workflows.

## Main idea

Use a simple branch-based workflow:

```text
main = stable version of the project
one feature/setup branch = current task
merge when the task works
delete the branch
repeat
```

Most of the time there should only be two local branches that matter:

```text
main
current-task-branch
```

Do not create many branches in advance. Branches are temporary workspaces, not a project plan.

## The purpose of `main`

The `main` branch should always represent the latest stable version of the project.

Stable does not mean perfect. It means:

- The project structure makes sense
- The app is not knowingly broken
- The latest committed state is safe to show or continue from
- Setup instructions are not completely misleading
- Finished features are merged only after they work at a basic level

Do not commit unfinished experimental work directly to `main` once real backend/frontend code exists.

For the very first commit, it is fine to commit directly to `main`.

Example first commit:

```text
chore(repo): add initial project structure
```

This can include:

```text
.gitignore
.editorconfig
LICENSE
README.md
backend/.gitkeep
frontend/.gitkeep
docs/architecture.md
docs/api.md
```

After this first foundation commit, use branches for real setup and feature work.

## Branch naming convention

Use this format:

```text
type/short-description
```

Examples:

```text
chore/docker-postgres
chore/backend-setup
chore/frontend-setup
ci/basic-workflows
feat/auth
feat/customers
feat/products
feat/orders
feat/dashboard
feat/audit-log
fix/orders-stock-decrement
refactor/api-error-handling
docs/readme-polish
```

Do not use vague branch names like:

```text
work
changes
fixes
backend
frontend
test
stuff
new-feature
```

A branch name should answer: what work is being done here?

## Recommended branch order

The expected early branch sequence for FlowOps Lite is:

```text
main
↓
chore/initial-setup
↓ merge
chore/docker-postgres
↓ merge
chore/backend-setup
↓ merge
chore/frontend-setup
↓ merge
ci/basic-workflows
↓ merge
feat/auth
↓ merge
feat/customers
↓ merge
feat/products
↓ merge
feat/orders
↓ merge
feat/dashboard
↓ merge
feat/audit-log
↓ merge
docs/final-readme
```

This does not mean all these branches should exist at the same time.

Create a branch only when you start that task.

## What each setup branch should contain

### `chore/initial-setup`

Purpose: create the basic repository structure.

Should contain:

```text
backend/.gitkeep
frontend/.gitkeep
docs/architecture.md
docs/api.md
README.md updates if needed
```

Possible commits:

```text
chore(repo): add monorepo folder structure
docs(architecture): add initial architecture notes
docs(api): add planned API contract
```

Should not contain:

- ASP.NET project files
- Next.js app files
- Docker setup
- Real feature code

### `chore/docker-postgres`

Purpose: add local PostgreSQL setup.

Should contain:

```text
docker-compose.yml
.env.example
README.md database instructions
```

Possible commits:

```text
chore(docker): add postgres service
docs(readme): add database startup instructions
```

Should not contain:

- EF Core migrations
- Entities
- DbContext
- Frontend code

### `chore/backend-setup`

Purpose: scaffold the ASP.NET Core backend.

Should contain:

```text
backend/FlowOps.sln
backend/src/FlowOps.Api/
backend/src/FlowOps.Application/
backend/src/FlowOps.Domain/
backend/src/FlowOps.Infrastructure/
backend/tests/FlowOps.UnitTests/
backend/tests/FlowOps.IntegrationTests/
```

It may also contain:

- Basic health endpoint
- Swagger setup
- Project references
- Minimal backend README/update

Possible commits:

```text
chore(api): create backend solution
chore(api): add clean architecture projects
chore(api): configure project references
feat(api): add health check endpoint
docs(api): document backend startup command
```

Should not contain:

- Auth implementation
- Products module
- Customers module
- Orders module
- Complex database logic

### `chore/frontend-setup`

Purpose: scaffold the Next.js frontend.

Should contain:

```text
frontend/package.json
frontend/next.config.*
frontend/tsconfig.json
frontend/src/app/
frontend/src/components/
frontend/src/lib/
frontend/src/types/
frontend/src/styles/
```

It may also contain:

- Basic home page
- Global styles
- Tailwind setup
- Path aliases
- Basic layout placeholder

Possible commits:

```text
chore(web): scaffold Next.js app
chore(web): configure TypeScript and path aliases
chore(web): add base folder structure
chore(web): add global styles
```

Should not contain:

- Login page
- Dashboard
- Product pages
- Customer pages
- Real API integration

### `ci/basic-workflows`

Purpose: add basic GitHub Actions checks.

Should contain:

```text
.github/workflows/backend.yml
.github/workflows/frontend.yml
README.md CI notes if needed
```

Possible commits:

```text
ci(api): add backend build workflow
ci(web): add frontend build workflow
docs(readme): add CI status notes
```

## What each feature branch should contain

A feature branch should contain one meaningful deliverable.

Good examples:

```text
feat/auth
feat/customers
feat/products
feat/orders
feat/dashboard
feat/audit-log
```

A branch can include both backend and frontend work if they belong to the same feature.

For example, `feat/products` may contain:

- Product entity
- EF Core product configuration
- Product DTOs
- Product endpoints
- Product frontend API module
- Product list page
- Product form
- Product validation
- Product tests

That is okay because the finished result is one coherent feature: product management.

Do not split branches too aggressively. For this project, `feat/products` is better than managing several tiny branches like:

```text
feat/product-entity
feat/product-controller
feat/product-table
feat/product-form
feat/product-validation
```

That would create unnecessary overhead.

## Commit message convention

Use Conventional Commits in this format:

```text
type(scope): short description
```

Examples:

```text
feat(products): add product creation endpoint
fix(orders): prevent submitting empty orders
refactor(api): move error handling into middleware
test(orders): cover invalid status transitions
docs(readme): add local setup instructions
chore(repo): add editorconfig
ci(api): run backend tests on pull requests
```

## Commit types

Use these commit types:

| Type | Use when |
|---|---|
| `feat` | Adding a new feature or user-visible capability |
| `fix` | Fixing a bug or incorrect behavior |
| `refactor` | Changing code structure without changing behavior |
| `test` | Adding or updating tests |
| `docs` | Updating documentation only |
| `chore` | Project setup, tooling, maintenance, dependencies |
| `ci` | GitHub Actions or CI/CD changes |
| `build` | Build system or packaging changes |
| `style` | Formatting-only changes, no behavior change |
| `perf` | Performance improvement |
| `revert` | Reverting a previous commit |

## Recommended scopes

Use scopes that match the project structure or feature area.

General scopes:

```text
repo
api
web
docs
ci
docker
db
tests
```

Feature scopes:

```text
auth
customers
products
inventory
orders
dashboard
audit
ui
layout
```

Backend architecture scopes, when useful:

```text
domain
application
infrastructure
```

Do not overthink the scope. Choose the one that makes the commit easiest to understand.

## Commit message style

Use imperative mood.

Good:

```text
feat(products): add product entity
fix(auth): reject expired refresh tokens
docs(readme): add backend startup command
```

Weak:

```text
feat(products): added product entity
fix(auth): fixed refresh tokens
docs(readme): updated backend startup command
```

The message should complete this sentence:

```text
This commit will...
```

Example:

```text
This commit will add product entity.
```

So the commit message should be:

```text
feat(products): add product entity
```

## Bad commit messages

Avoid these:

```text
update
fix
fix2
changes
final
final fix
backend stuff
frontend stuff
working now
misc
wip
```

These messages are useless because they do not explain what changed.

A good commit message should make sense months later without opening the diff.

## How to split commits

Split commits by logical change, not by time and not by random file groups.

A good commit should usually do one thing.

Ask before committing:

```text
Can I describe this change clearly in one sentence?
Could I revert this commit without reverting five unrelated things?
Would this commit make sense to another developer?
```

If yes, the commit is probably good.

If no, split it.

## Examples of good commit splitting

### Products feature

Instead of one huge commit:

```text
feat(products): add products
```

Use several meaningful commits:

```text
feat(products): add product entity
feat(db): configure product table
feat(products): add product DTOs
feat(products): add product endpoints
feat(web): add product API client
feat(products): add products list page
feat(products): add product form
test(products): cover product validation rules
```

### Orders feature

Orders contain important business logic, so the commits should show that clearly:

```text
feat(orders): add order status enum
feat(orders): add order aggregate
feat(orders): enforce status transition rules
feat(orders): snapshot order line prices
feat(orders): calculate VAT and total amount
feat(orders): decrement stock on submission
feat(api): add order endpoints
feat(api): add order status transition endpoints
test(orders): cover draft to submitted transition
test(orders): reject invalid status transitions
```

This history shows that the order module was built intentionally, not dumped into the repo randomly.

### Auth feature

```text
feat(auth): add identity user model
feat(auth): configure JWT authentication
feat(auth): add login endpoint
feat(auth): add refresh token endpoint
feat(auth): add current user endpoint
feat(web): add login page
feat(auth): add protected route handling
test(auth): cover invalid login attempt
```

## What to commit together

Commit files together when they are part of the same logical change.

Example:

```text
feat(products): add product entity
```

This commit may include:

```text
backend/src/FlowOps.Domain/Products/Product.cs
backend/src/FlowOps.Domain/Products/ProductStatus.cs
```

Example:

```text
feat(db): configure product table
```

This commit may include:

```text
backend/src/FlowOps.Infrastructure/Data/Configurations/ProductConfiguration.cs
backend/src/FlowOps.Infrastructure/Data/AppDbContext.cs
```

Example:

```text
feat(products): add products list page
```

This commit may include:

```text
frontend/src/app/(app)/products/page.tsx
frontend/src/components/features/products/ProductsTable.tsx
frontend/src/components/features/products/ProductFilters.tsx
```

## What not to commit together

Do not mix unrelated work.

Bad commit:

```text
feat(products): add products page
```

But inside the commit:

```text
Product page
Sidebar redesign
README rewrite
Docker changes
Auth bug fix
Formatting in unrelated files
```

That commit is bad because the message lies. It says products, but the commit contains half the project.

Split it into separate commits:

```text
feat(products): add products page
fix(auth): handle missing access token
docs(readme): update local setup section
refactor(layout): simplify sidebar navigation
```

## The staging rule

Do not blindly use this every time:

```bash
git add .
```

It is fast, but it can accidentally include unrelated files.

Before committing, run:

```bash
git status
git diff
```

Then stage specific files:

```bash
git add backend/src/FlowOps.Domain/Products/Product.cs
git add backend/src/FlowOps.Domain/Products/ProductStatus.cs
```

Or use patch mode:

```bash
git add -p
```

Patch mode is useful when one file contains multiple unrelated changes.

## Basic workflow commands

Start a new task:

```bash
git switch main
git pull
git switch -c feat/products
```

Check changes:

```bash
git status
git diff
```

Stage and commit:

```bash
git add path/to/file
git commit -m "feat(products): add product entity"
```

Merge when finished:

```bash
git switch main
git merge feat/products
git push
git branch -d feat/products
```

If the branch was pushed to GitHub, also delete the remote branch after merging:

```bash
git push origin --delete feat/products
```

## When to merge a branch

Merge a branch when:

- The task is finished enough to continue from
- The app builds, if build scripts exist
- Relevant tests pass, if tests exist
- You have reviewed `git status` and `git diff`
- There are no obvious debug leftovers
- There are no secrets or local environment files
- The branch does not contain random unrelated work

Do not merge just because you are tired.

## What if the branch becomes too big?

If a branch starts becoming too large, do not panic.

First, commit the finished logical pieces.

Then decide whether the remaining work should stay in the branch or move to another branch after merging.

Example:

You are working on `feat/products`, but you also started improving the sidebar.

If the sidebar change is not required for products, keep it out of the products commit.

Options:

1. Restore the sidebar file if the change was accidental.
2. Stash it and apply it later.
3. Commit it separately only if it is truly part of the feature.

Commands:

```bash
git restore path/to/file
```

or:

```bash
git stash push -m "sidebar improvement"
```

Then later:

```bash
git stash pop
```

## What if you accidentally staged the wrong file?

Unstage it:

```bash
git restore --staged path/to/file
```

The file stays changed, but it will not be included in the next commit.

## What if you want to discard local changes?

Discard changes in one file:

```bash
git restore path/to/file
```

Be careful. This deletes your uncommitted changes in that file.

## What if you forgot a file in the last commit?

Add the file and amend the commit:

```bash
git add missing-file
git commit --amend
```

If you only want to keep the same commit message:

```bash
git commit --amend --no-edit
```

Only amend commits that have not been shared with others, or that are on your own branch.

## Pull requests

At the beginning, local merges are fine.

Once GitHub Actions are added, prefer pull requests even if you work alone.

A pull request should include:

```markdown
## Summary

Briefly explain what this branch adds or changes.

## Changes

- Change 1
- Change 2
- Change 3

## Testing

- Explain what you tested manually
- Mention tests that were run
```

Example PR title:

```text
Add product management
```

Example PR description:

```markdown
## Summary

Adds the first version of product management.

## Changes

- Add product entity
- Add EF Core product configuration
- Add product endpoints
- Add product API client
- Add products list page

## Testing

- Ran backend tests
- Tested product creation through Swagger
- Checked product list page in the browser
```

## Recommended commits by project phase

### Initial repo

```text
chore(repo): add initial project structure
docs(architecture): add initial architecture documentation
docs(api): add planned API documentation
```

### Docker

```text
chore(docker): add postgres service
chore(env): add example environment variables
docs(readme): add local database setup instructions
```

### Backend setup

```text
chore(api): create backend solution
chore(api): add clean architecture projects
chore(api): configure project references
feat(api): add health check endpoint
```

### Frontend setup

```text
chore(web): scaffold Next.js app
chore(web): configure TypeScript and path aliases
chore(web): add base app structure
chore(web): add global styles
```

### CI

```text
ci(api): add backend build workflow
ci(web): add frontend build workflow
```

### Auth

```text
feat(auth): configure identity user model
feat(auth): add JWT authentication
feat(auth): add login endpoint
feat(auth): add refresh token endpoint
feat(web): add login page
feat(auth): protect app routes
```

### Customers

```text
feat(customers): add customer entity
feat(db): configure customer table
feat(customers): add customer endpoints
feat(web): add customer API client
feat(customers): add customers list page
feat(customers): add customer detail page
```

### Products

```text
feat(products): add product entity
feat(db): configure product table
feat(products): add product endpoints
feat(web): add product API client
feat(products): add products list page
feat(products): add product form
fix(products): show low-stock warning
```

### Orders

```text
feat(orders): add order status enum
feat(orders): add order aggregate
feat(orders): enforce status transition rules
feat(orders): snapshot order line prices
feat(orders): decrement stock on submission
feat(api): add order transition endpoints
feat(web): add order creation page
feat(web): add order detail page
test(orders): cover invalid status transitions
```

### Dashboard

```text
feat(dashboard): add KPI endpoint
feat(dashboard): add revenue trend endpoint
feat(web): add dashboard KPI cards
feat(web): add revenue chart
```

### Audit log

```text
feat(audit): add audit log entity
feat(audit): write order status audit entries
feat(api): add audit log endpoint
feat(web): add audit log page
```

## Final rules

Keep the workflow boring.

Use this loop:

```text
start from main
create one branch
make logical commits
merge when working
delete branch
repeat
```

The important part is not having a fancy Git setup. The important part is avoiding a messy history that makes the project look improvised.

A clean Git history should show that FlowOps Lite was built with intention.
