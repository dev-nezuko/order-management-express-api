# Order Management API - Coding Test

## Purpose

This is an **advanced Node.js + Express + TypeScript coding test** designed for engineers .It assesses your ability to:

- Design a well-structured Express API
- Use TypeScript idiomatically (types, interfaces, generics)
- Implement a layered architecture (DB layer → services → routes)
- Work with JSON-file "database" abstractions
- Implement CRUD + query endpoints with filtering, pagination, and aggregation
- Create middleware and proper error handling

---

## What's Provided

### `src/` — Candidate Code (Your Work)

Contains **stubs** with function signatures and `TODO` comments for:

- `config/` — Environment configuration
- `types/` — TypeScript interfaces for domain entities
- `db/` — JSON store and repository layer
- `services/` — Business logic layer
- `routes/` — Express route handlers
- `middleware/` — Auth, logging, and error handling middleware
- `errors/` — Custom error classes
- `app.ts` — Express app setup
- `server.ts` — HTTP server entry point

### `data/` — JSON "Database"

Pre-populated JSON files serving as your data source:

- `customers.json` — Customer records
- `products.json` — Product catalog
- `orders.json` — Order records with line items

### `tests/` — Test Suite

Vitest + Supertest integration tests that validate your implementation.

### `solutions/` — Reference Implementation (Interviewer Only)

Complete, working implementations. **Do not share with candidates.**

---

## What You Should Do

### Implement the TODOs in `src/`

1. **Repositories** (`src/db/repositories/`)
   - Implement data access functions using the in-memory JSON store

2. **Services** (`src/services/`)
   - Implement business logic, validation, and data transformation

3. **Middleware** (`src/middleware/`)
   - Implement auth, logging, and error handling middleware

4. **Routes** (`src/routes/`)
   - Implement Express route handlers

5. **App Setup** (`src/app.ts`)
   - Wire up middleware and routes correctly

### Rules

- ✅ Implement all functions marked with `TODO`
- ✅ Use proper TypeScript types (avoid `any`)
- ✅ Use the provided `AppError` class for error handling
- ❌ Do NOT change function names, parameters, or exported types
- ❌ Do NOT modify tests, data JSON files, or config files
- ❌ Do NOT install additional dependencies

### Goal

**Make all tests pass.**

---

## API Specification

### Authentication

Protected routes require an `x-api-key` header matching the configured API key.

- Missing/invalid key → `401 { "error": "Unauthorized" }`

### Endpoints

#### `GET /orders`

Returns paginated, filterable list of orders.

**Query Parameters:**
- `status` — Filter by status (`pending`, `paid`, `shipped`, `cancelled`)
- `customerId` — Filter by customer ID
- `page` — Page number (default: 1)
- `pageSize` — Items per page (default: 10)

**Response:**
```json
{
  "data": [...],
  "page": 1,
  "pageSize": 10,
  "total": 23
}
```

#### `GET /orders/:id`

Returns hydrated order with customer and product details.

**Response:**
```json
{
  "order": { "id": "...", "status": "...", "createdAt": "..." },
  "customer": { "id": "...", "name": "...", "tier": "..." },
  "lines": [
    {
      "product": { "id": "...", "name": "...", "priceCents": 1999, "category": "..." },
      "quantity": 2,
      "lineTotalCents": 3998
    }
  ],
  "totalCents": 3998
}
```

- Invalid ID → `404 { "error": "Order not found" }`

#### `POST /orders`

Creates a new order (in memory only).

**Request Body:**
```json
{
  "customerId": "cust-1",
  "lines": [
    { "productId": "prod-1", "quantity": 2 }
  ]
}
```

**Validations:**
- `customerId` must exist → `400` if not
- All `productId`s must exist → `400` if not
- `quantity` must be > 0 → `400` if not

**Response:** `201` with hydrated order view

#### `GET /customers`

Returns all customers. Optionally filter by `tier` query parameter.

#### `GET /customers/:id/summary`

Returns customer summary with aggregated order statistics.

**Response:**
```json
{
  "customer": { "id": "...", "name": "...", "tier": "..." },
  "orders": [
    { "id": "...", "status": "paid", "totalCents": 12345 }
  ],
  "stats": {
    "totalOrders": 3,
    "totalSpendCents": 45678,
    "ordersByStatus": {
      "pending": 1,
      "paid": 2,
      "shipped": 0,
      "cancelled": 0
    }
  }
}
```

- Non-existent customer → `404 { "error": "Customer not found" }`

---

## How to Run

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
npm test
```

### Run Development Server

```bash
npm run dev
```

Server starts at `http://localhost:3000`

### Type Check

```bash
npm run typecheck
```

---

## For Interviewers

### Verify Solutions

Run the test suite against the `solutions/` directory to verify all implementations are correct:

```bash
npm run test:solutions
```

This script will:
1. Back up the current `src/` directory
2. Copy all solution files to `src/`
3. Run the test suite
4. Restore the original `src/` stubs

All 54 tests should pass when run against the solutions.

---

## Estimated Time

**90–120 minutes**

---

## Evaluation Criteria

1. **Correctness** — API behavior matches specification, all tests pass
2. **TypeScript Usage** — Proper types, interfaces, and generics; minimal `any`
3. **Architecture** — Clean separation between db, services, and routes
4. **Error Handling** — Consistent use of `AppError` and error middleware
5. **Code Quality** — Readable, well-organized, follows conventions

---

## Environment Variables

| Variable  | Description         | Default     |
|-----------|---------------------|-------------|
| `PORT`    | Server port         | `3000`      |
| `API_KEY` | API authentication  | `test-key`  |

---

Good luck! 🚀

