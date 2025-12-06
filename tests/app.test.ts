import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { resetStore } from "../src/db/jsonStore.js";

const API_KEY = "test-key";

describe("Order Management API", () => {
  beforeEach(() => {
    // Reset the store before each test to ensure clean state
    resetStore();
  });

  describe("Authentication", () => {
    it("should return 401 when no API key is provided for protected routes", async () => {
      const response = await request(app).get("/orders");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 401 when invalid API key is provided", async () => {
      const response = await request(app)
        .get("/orders")
        .set("x-api-key", "invalid-key");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Unauthorized" });
    });

    it("should allow access with valid API key", async () => {
      const response = await request(app)
        .get("/orders")
        .set("x-api-key", API_KEY);

      expect(response.status).toBe(200);
    });
  });

  describe("GET /orders", () => {
    it("should return paginated list of orders", async () => {
      const response = await request(app)
        .get("/orders")
        .set("x-api-key", API_KEY);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("page", 1);
      expect(response.body).toHaveProperty("pageSize", 10);
      expect(response.body).toHaveProperty("total");
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should filter orders by status", async () => {
      const response = await request(app)
        .get("/orders?status=pending")
        .set("x-api-key", API_KEY);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);

      // All returned orders should have pending status
      for (const order of response.body.data) {
        expect(order.status).toBe("pending");
      }
    });

    it("should filter orders by customerId", async () => {
      const response = await request(app)
        .get("/orders?customerId=cust-1")
        .set("x-api-key", API_KEY);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeInstanceOf(Array);

      // All returned orders should belong to cust-1
      for (const order of response.body.data) {
        expect(order.customerId).toBe("cust-1");
      }
    });

    it("should respect pagination parameters", async () => {
      const response = await request(app)
        .get("/orders?page=1&pageSize=2")
        .set("x-api-key", API_KEY);

      expect(response.status).toBe(200);
      expect(response.body.page).toBe(1);
      expect(response.body.pageSize).toBe(2);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
    });

    it("should combine status and customerId filters", async () => {
      const response = await request(app)
        .get("/orders?status=paid&customerId=cust-1")
        .set("x-api-key", API_KEY);

      expect(response.status).toBe(200);

      for (const order of response.body.data) {
        expect(order.status).toBe("paid");
        expect(order.customerId).toBe("cust-1");
      }
    });
  });

  describe("GET /orders/:id", () => {
    it("should return a hydrated order", async () => {
      const response = await request(app)
        .get("/orders/order-1")
        .set("x-api-key", API_KEY);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("order");
      expect(response.body).toHaveProperty("customer");
      expect(response.body).toHaveProperty("lines");
      expect(response.body).toHaveProperty("totalCents");

      // Check order structure
      expect(response.body.order).toHaveProperty("id", "order-1");
      expect(response.body.order).toHaveProperty("status");
      expect(response.body.order).toHaveProperty("createdAt");

      // Check customer structure
      expect(response.body.customer).toHaveProperty("id");
      expect(response.body.customer).toHaveProperty("name");
      expect(response.body.customer).toHaveProperty("tier");

      // Check lines structure
      expect(Array.isArray(response.body.lines)).toBe(true);
      if (response.body.lines.length > 0) {
        const line = response.body.lines[0];
        expect(line).toHaveProperty("product");
        expect(line).toHaveProperty("quantity");
        expect(line).toHaveProperty("lineTotalCents");
        expect(line.product).toHaveProperty("id");
        expect(line.product).toHaveProperty("name");
        expect(line.product).toHaveProperty("priceCents");
      }

      // Check totalCents is a number
      expect(typeof response.body.totalCents).toBe("number");
    });

    it("should return 404 for non-existent order", async () => {
      const response = await request(app)
        .get("/orders/order-nonexistent")
        .set("x-api-key", API_KEY);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });

    it("should calculate correct totalCents", async () => {
      const response = await request(app)
        .get("/orders/order-1")
        .set("x-api-key", API_KEY);

      expect(response.status).toBe(200);

      // Calculate expected total from lines
      const expectedTotal = response.body.lines.reduce(
        (sum: number, line: { lineTotalCents: number }) => sum + line.lineTotalCents,
        0
      );

      expect(response.body.totalCents).toBe(expectedTotal);
    });
  });

  describe("POST /orders", () => {
    it("should create a new order with valid data", async () => {
      const newOrder = {
        customerId: "cust-1",
        lines: [
          { productId: "prod-1", quantity: 2 },
          { productId: "prod-2", quantity: 1 },
        ],
      };

      const response = await request(app)
        .post("/orders")
        .set("x-api-key", API_KEY)
        .send(newOrder);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("order");
      expect(response.body).toHaveProperty("customer");
      expect(response.body).toHaveProperty("lines");
      expect(response.body).toHaveProperty("totalCents");

      // Verify order was created with pending status
      expect(response.body.order.status).toBe("pending");

      // Verify customer matches
      expect(response.body.customer.id).toBe("cust-1");

      // Verify lines are hydrated
      expect(response.body.lines.length).toBe(2);
    });

    it("should return 400 for non-existent customer", async () => {
      const newOrder = {
        customerId: "cust-nonexistent",
        lines: [{ productId: "prod-1", quantity: 1 }],
      };

      const response = await request(app)
        .post("/orders")
        .set("x-api-key", API_KEY)
        .send(newOrder);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 for non-existent product", async () => {
      const newOrder = {
        customerId: "cust-1",
        lines: [{ productId: "prod-nonexistent", quantity: 1 }],
      };

      const response = await request(app)
        .post("/orders")
        .set("x-api-key", API_KEY)
        .send(newOrder);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 for invalid quantity (zero)", async () => {
      const newOrder = {
        customerId: "cust-1",
        lines: [{ productId: "prod-1", quantity: 0 }],
      };

      const response = await request(app)
        .post("/orders")
        .set("x-api-key", API_KEY)
        .send(newOrder);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 for invalid quantity (negative)", async () => {
      const newOrder = {
        customerId: "cust-1",
        lines: [{ productId: "prod-1", quantity: -1 }],
      };

      const response = await request(app)
        .post("/orders")
        .set("x-api-key", API_KEY)
        .send(newOrder);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should return 400 for empty lines array", async () => {
      const newOrder = {
        customerId: "cust-1",
        lines: [],
      };

      const response = await request(app)
        .post("/orders")
        .set("x-api-key", API_KEY)
        .send(newOrder);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should require auth for POST /orders", async () => {
      const newOrder = {
        customerId: "cust-1",
        lines: [{ productId: "prod-1", quantity: 1 }],
      };

      const response = await request(app).post("/orders").send(newOrder);

      expect(response.status).toBe(401);
    });
  });

  describe("GET /customers", () => {
    it("should return all customers", async () => {
      const response = await request(app).get("/customers");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check customer structure
      const customer = response.body[0];
      expect(customer).toHaveProperty("id");
      expect(customer).toHaveProperty("name");
      expect(customer).toHaveProperty("tier");
    });

    it("should filter customers by tier", async () => {
      const response = await request(app).get("/customers?tier=premium");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      // All returned customers should have premium tier
      for (const customer of response.body) {
        expect(customer.tier).toBe("premium");
      }
    });

    it("should not require auth for /customers", async () => {
      const response = await request(app).get("/customers");

      expect(response.status).toBe(200);
    });
  });

  describe("GET /customers/:id/summary", () => {
    it("should return customer summary with orders and stats", async () => {
      const response = await request(app).get("/customers/cust-1/summary");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("customer");
      expect(response.body).toHaveProperty("orders");
      expect(response.body).toHaveProperty("stats");

      // Check customer structure
      expect(response.body.customer).toHaveProperty("id", "cust-1");
      expect(response.body.customer).toHaveProperty("name");
      expect(response.body.customer).toHaveProperty("tier");

      // Check orders structure
      expect(Array.isArray(response.body.orders)).toBe(true);
      if (response.body.orders.length > 0) {
        const order = response.body.orders[0];
        expect(order).toHaveProperty("id");
        expect(order).toHaveProperty("status");
        expect(order).toHaveProperty("totalCents");
      }

      // Check stats structure
      expect(response.body.stats).toHaveProperty("totalOrders");
      expect(response.body.stats).toHaveProperty("totalSpendCents");
      expect(response.body.stats).toHaveProperty("ordersByStatus");
      expect(response.body.stats.ordersByStatus).toHaveProperty("pending");
      expect(response.body.stats.ordersByStatus).toHaveProperty("paid");
      expect(response.body.stats.ordersByStatus).toHaveProperty("shipped");
      expect(response.body.stats.ordersByStatus).toHaveProperty("cancelled");
    });

    it("should return 404 for non-existent customer", async () => {
      const response = await request(app).get("/customers/cust-nonexistent/summary");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });

    it("should calculate correct stats", async () => {
      const response = await request(app).get("/customers/cust-1/summary");

      expect(response.status).toBe(200);

      const { orders, stats } = response.body;

      // Verify totalOrders matches orders array length
      expect(stats.totalOrders).toBe(orders.length);

      // Verify totalSpendCents is sum of order totals
      const expectedTotal = orders.reduce(
        (sum: number, order: { totalCents: number }) => sum + order.totalCents,
        0
      );
      expect(stats.totalSpendCents).toBe(expectedTotal);

      // Verify ordersByStatus counts
      const statusCounts = {
        pending: 0,
        paid: 0,
        shipped: 0,
        cancelled: 0,
      };
      for (const order of orders) {
        statusCounts[order.status as keyof typeof statusCounts]++;
      }
      expect(stats.ordersByStatus).toEqual(statusCounts);
    });

    it("should not require auth for /customers/:id/summary", async () => {
      const response = await request(app).get("/customers/cust-1/summary");

      expect(response.status).toBe(200);
    });
  });
});

