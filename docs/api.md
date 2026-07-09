# API Documentation

This document describes the planned REST API for FlowOps Lite.

The API is built with ASP.NET Core and is consumed by the Next.js frontend.

The document will be updated as endpoints are implemented.

## Base URL

Local development:

```text
http://localhost:5000/api
```

Production URL will be added after deployment.

## General conventions

The API uses REST-style resource routes.

Examples:

```text
GET    /api/products
POST   /api/products
GET    /api/products/{id}
PUT    /api/products/{id}
DELETE /api/products/{id}
```

State changes that represent business actions use command-style sub-routes.

Example:

```text
POST /api/orders/{id}/submit
```

This is used instead of treating every business action as a simple update.

## Response format

For single resources, the API returns the resource directly.

Example:

```json
{
  "id": "9b9a9bb5-5e7e-4d1f-ae74-39128a48b9e2",
  "name": "Example Product"
}
```

For list endpoints, the API returns paginated results.

Example:

```json
{
  "items": [],
  "totalCount": 0,
  "page": 1,
  "pageSize": 20,
  "totalPages": 0
}
```

## Pagination

List endpoints should support pagination.

Common query parameters:

```text
page=1
pageSize=20
search=example
```

Example:

```text
GET /api/products?page=1&pageSize=20&search=laptop
```

## Error responses

Validation errors should return a clear error response.

Example:

```json
{
  "title": "Validation failed",
  "status": 400,
  "errors": {
    "name": ["Product name is required."],
    "unitPrice": ["Unit price must be greater than zero."]
  }
}
```

Unexpected server errors should not expose internal exception details to the frontend.

## Authentication

Authentication uses JWT access tokens and refresh tokens.

Planned endpoints:

```text
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

### POST /api/auth/login

Logs in a user.

Request:

```json
{
  "email": "admin@example.com",
  "password": "Password123!"
}
```

Response:

```json
{
  "accessToken": "jwt-access-token",
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "fullName": "Demo Admin",
    "role": "Admin"
  }
}
```

### POST /api/auth/refresh

Refreshes an expired access token.

The refresh token is expected to be stored in an HttpOnly cookie.

Response:

```json
{
  "accessToken": "new-jwt-access-token"
}
```

### POST /api/auth/logout

Logs out the current user and invalidates the refresh token.

### GET /api/auth/me

Returns the currently authenticated user.

Response:

```json
{
  "id": "uuid",
  "email": "admin@example.com",
  "fullName": "Demo Admin",
  "role": "Admin"
}
```

## Products

Products represent items that can be sold and tracked in inventory.

Planned endpoints:

```text
GET    /api/products
GET    /api/products/{id}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

### GET /api/products

Returns a paginated list of products.

Supported query parameters:

```text
page
pageSize
search
category
stockStatus
```

Example:

```text
GET /api/products?page=1&pageSize=20&search=keyboard&stockStatus=low
```

### GET /api/products/{id}

Returns one product by ID.

### POST /api/products

Creates a product.

Example request:

```json
{
  "name": "Wireless Keyboard",
  "sku": "KEY-001",
  "category": "Accessories",
  "unitPrice": 799.00,
  "stockQuantity": 25,
  "lowStockThreshold": 5,
  "description": "Compact wireless keyboard"
}
```

### PUT /api/products/{id}

Updates a product.

### DELETE /api/products/{id}

Archives a product.

Products should not be hard-deleted if they are connected to historical orders.

## Customers

Customers represent companies or people placing orders.

Planned endpoints:

```text
GET    /api/customers
GET    /api/customers/{id}
POST   /api/customers
PUT    /api/customers/{id}
DELETE /api/customers/{id}
GET    /api/customers/{id}/orders
```

### GET /api/customers

Returns a paginated list of customers.

Supported query parameters:

```text
page
pageSize
search
status
```

Search should support company name, organization number, email, or contact person where possible.

### GET /api/customers/{id}

Returns one customer by ID.

### POST /api/customers

Creates a customer.

Example request:

```json
{
  "companyName": "Nordic Office AS",
  "organizationNumber": "999999999",
  "contactPerson": "Anna Hansen",
  "email": "anna@example.com",
  "phone": "+47 123 45 678",
  "addressLine1": "Examplegata 12",
  "postalCode": "0150",
  "city": "Oslo",
  "country": "Norway"
}
```

### PUT /api/customers/{id}

Updates a customer.

### DELETE /api/customers/{id}

Archives or deactivates a customer.

### GET /api/customers/{id}/orders

Returns order history for a customer.

## Orders

Orders are the main business workflow in the system.

Planned endpoints:

```text
GET  /api/orders
GET  /api/orders/{id}
POST /api/orders
PUT  /api/orders/{id}

POST /api/orders/{id}/submit
POST /api/orders/{id}/fulfill
POST /api/orders/{id}/complete
POST /api/orders/{id}/cancel
```

## Order status workflow

Orders follow this workflow:

```text
Draft → Submitted → Fulfilled → Completed
            ↓
        Cancelled
```

Status meaning:

* Draft: editable order
* Submitted: order is confirmed and stock is decremented
* Fulfilled: order has been prepared or delivered
* Completed: final read-only state
* Cancelled: terminal read-only state

Invalid transitions should be rejected by the backend.

Examples of invalid transitions:

* Draft → Completed
* Completed → Cancelled
* Cancelled → Submitted
* Submitted → Draft

### GET /api/orders

Returns a paginated list of orders.

Supported query parameters:

```text
page
pageSize
search
status
customerId
dateFrom
dateTo
```

### GET /api/orders/{id}

Returns one order by ID, including order lines.

### POST /api/orders

Creates a draft order.

Example request:

```json
{
  "customerId": "uuid",
  "expectedDeliveryDate": "2026-08-15",
  "notes": "Deliver after 12:00",
  "lines": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ]
}
```

The backend should snapshot the unit price from the product when the order line is created.

### PUT /api/orders/{id}

Updates a draft order.

Only draft orders should be fully editable.

### POST /api/orders/{id}/submit

Submits an order.

Rules:

* Order must be in Draft status
* Order must have at least one line
* Product stock must be available
* Stock is decremented when the order is submitted
* Submitted timestamp is set
* Audit log entry is created

### POST /api/orders/{id}/fulfill

Marks an order as fulfilled.

Rules:

* Order must be in Submitted status
* Fulfilled timestamp is set
* Audit log entry is created

### POST /api/orders/{id}/complete

Marks an order as completed.

Rules:

* Order must be in Fulfilled status
* Completed timestamp is set
* Order becomes read-only
* Audit log entry is created

### POST /api/orders/{id}/cancel

Cancels an order.

Rules:

* Order must not already be Completed
* Order must not already be Cancelled
* Cancelled timestamp is set
* Order becomes read-only
* Audit log entry is created

Stock restoration rules should be decided before implementing cancellation after submission.

## Dashboard

Dashboard endpoints return summarized business data.

Planned endpoints:

```text
GET /api/dashboard/kpis
GET /api/dashboard/revenue-trend
GET /api/dashboard/top-customers
GET /api/dashboard/recent-activity
```

### GET /api/dashboard/kpis

Returns the main KPI cards.

Expected data:

* Orders this month
* Revenue this month
* Low-stock product count
* Active customer count
* Comparison with previous month where relevant

### GET /api/dashboard/revenue-trend

Returns revenue data for the last 6 months.

### GET /api/dashboard/top-customers

Returns the top 5 customers by revenue for the current quarter.

### GET /api/dashboard/recent-activity

Returns the 10 most recent important actions.

Examples:

* Order submitted
* Order completed
* Product stock adjusted
* Customer created
* User logged in

## Audit log

Audit log endpoints are admin-only.

Planned endpoints:

```text
GET /api/audit-log
GET /api/audit-log/{id}
```

Supported query parameters:

```text
page
pageSize
userId
actionType
dateFrom
dateTo
```

Audit log entries should include:

* ID
* Action type
* User ID
* Entity type
* Entity ID
* Created timestamp
* Details as JSON

Example response item:

```json
{
  "id": "uuid",
  "actionType": "OrderSubmitted",
  "userId": "uuid",
  "entityType": "Order",
  "entityId": "uuid",
  "createdAt": "2026-08-15T10:30:00Z",
  "details": {
    "orderNumber": "ORD-1001",
    "previousStatus": "Draft",
    "newStatus": "Submitted"
  }
}
```

## Authorization rules

Planned access rules:

```text
Admin:
- Full access
- Can view audit log
- Can manage users/settings if implemented

Standard:
- Can manage products
- Can manage customers
- Can manage orders
- Cannot access audit log
```

Admin-only endpoints should use role-based authorization.

## Notes

This API document starts as a planned contract. It should be updated as implementation decisions become final.

The API should stay simple and predictable. FlowOps Lite is not trying to be a generic enterprise platform. The goal is to support the product, customer, and order workflows clearly.
