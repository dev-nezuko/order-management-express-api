# Target API contract

These endpoints specify the unfinished exercise, not current working behavior.

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
