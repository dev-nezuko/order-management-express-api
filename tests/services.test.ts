import { describe, it, expect, beforeEach } from "vitest";
import { initializeStore, resetStore } from "../src/db/jsonStore.js";
import * as orderService from "../src/services/orderService.js";
import * as customerService from "../src/services/customerService.js";
import { AppError } from "../src/errors/AppError.js";

describe("Order Service", () => {
  beforeEach(() => {
    resetStore();
  });

  describe("calculateOrderTotal", () => {
    it("should calculate total for single line", () => {
      const lines = [{ productId: "prod-1", quantity: 2 }];
      const total = orderService.calculateOrderTotal(lines);
      // prod-1 is TypeScript Handbook at 2999 cents
      expect(total).toBe(2999 * 2);
    });

    it("should calculate total for multiple lines", () => {
      const lines = [
        { productId: "prod-1", quantity: 1 }, // 2999
        { productId: "prod-2", quantity: 1 }, // 7999
      ];
      const total = orderService.calculateOrderTotal(lines);
      expect(total).toBe(2999 + 7999);
    });

    it("should return 0 for empty lines", () => {
      const total = orderService.calculateOrderTotal([]);
      expect(total).toBe(0);
    });
  });

  describe("hydrateOrderLines", () => {
    it("should hydrate lines with product details", () => {
      const lines = [{ productId: "prod-1", quantity: 2 }];
      const hydrated = orderService.hydrateOrderLines(lines);

      expect(hydrated).toHaveLength(1);
      expect(hydrated[0].product).toHaveProperty("id", "prod-1");
      expect(hydrated[0].product).toHaveProperty("name", "TypeScript Handbook");
      expect(hydrated[0].quantity).toBe(2);
      expect(hydrated[0].lineTotalCents).toBe(2999 * 2);
    });

    it("should handle multiple lines", () => {
      const lines = [
        { productId: "prod-1", quantity: 1 },
        { productId: "prod-2", quantity: 2 },
      ];
      const hydrated = orderService.hydrateOrderLines(lines);

      expect(hydrated).toHaveLength(2);
      expect(hydrated[0].product.id).toBe("prod-1");
      expect(hydrated[1].product.id).toBe("prod-2");
    });
  });

  describe("getHydratedOrder", () => {
    it("should return hydrated order with all details", () => {
      const result = orderService.getHydratedOrder("order-1");

      expect(result.order.id).toBe("order-1");
      expect(result.customer).toBeDefined();
      expect(result.lines).toBeInstanceOf(Array);
      expect(result.totalCents).toBeGreaterThan(0);
    });

    it("should throw 404 for non-existent order", () => {
      expect(() => orderService.getHydratedOrder("nonexistent")).toThrow(AppError);

      try {
        orderService.getHydratedOrder("nonexistent");
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(404);
      }
    });
  });

  describe("getOrdersPaginated", () => {
    it("should return paginated results with defaults", () => {
      const result = orderService.getOrdersPaginated({});

      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.total).toBeGreaterThan(0);
      expect(result.data).toBeInstanceOf(Array);
    });

    it("should filter by status", () => {
      const result = orderService.getOrdersPaginated({ status: "pending" });

      for (const order of result.data) {
        expect(order.status).toBe("pending");
      }
    });

    it("should filter by customerId", () => {
      const result = orderService.getOrdersPaginated({ customerId: "cust-1" });

      for (const order of result.data) {
        expect(order.customerId).toBe("cust-1");
      }
    });

    it("should paginate correctly", () => {
      const page1 = orderService.getOrdersPaginated({ page: 1, pageSize: 3 });
      const page2 = orderService.getOrdersPaginated({ page: 2, pageSize: 3 });

      expect(page1.data.length).toBeLessThanOrEqual(3);
      expect(page2.data.length).toBeLessThanOrEqual(3);

      // If there are enough orders, pages should have different data
      if (page1.total > 3 && page2.data.length > 0) {
        expect(page1.data[0].id).not.toBe(page2.data[0].id);
      }
    });
  });

  describe("validateCreateOrderRequest", () => {
    it("should pass for valid request", () => {
      const request = {
        customerId: "cust-1",
        lines: [{ productId: "prod-1", quantity: 1 }],
      };

      expect(() => orderService.validateCreateOrderRequest(request)).not.toThrow();
    });

    it("should throw for non-existent customer", () => {
      const request = {
        customerId: "nonexistent",
        lines: [{ productId: "prod-1", quantity: 1 }],
      };

      expect(() => orderService.validateCreateOrderRequest(request)).toThrow(AppError);
    });

    it("should throw for non-existent product", () => {
      const request = {
        customerId: "cust-1",
        lines: [{ productId: "nonexistent", quantity: 1 }],
      };

      expect(() => orderService.validateCreateOrderRequest(request)).toThrow(AppError);
    });

    it("should throw for invalid quantity", () => {
      const request = {
        customerId: "cust-1",
        lines: [{ productId: "prod-1", quantity: 0 }],
      };

      expect(() => orderService.validateCreateOrderRequest(request)).toThrow(AppError);
    });

    it("should throw for empty lines", () => {
      const request = {
        customerId: "cust-1",
        lines: [],
      };

      expect(() => orderService.validateCreateOrderRequest(request)).toThrow(AppError);
    });
  });

  describe("createOrder", () => {
    it("should create and return hydrated order", () => {
      const request = {
        customerId: "cust-1",
        lines: [
          { productId: "prod-1", quantity: 2 },
          { productId: "prod-2", quantity: 1 },
        ],
      };

      const result = orderService.createOrder(request);

      expect(result.order).toHaveProperty("id");
      expect(result.order.status).toBe("pending");
      expect(result.customer.id).toBe("cust-1");
      expect(result.lines).toHaveLength(2);
      expect(result.totalCents).toBe(2999 * 2 + 7999);
    });

    it("should persist order in store", () => {
      const initialCount = orderService.getOrdersPaginated({}).total;

      orderService.createOrder({
        customerId: "cust-1",
        lines: [{ productId: "prod-1", quantity: 1 }],
      });

      const newCount = orderService.getOrdersPaginated({}).total;
      expect(newCount).toBe(initialCount + 1);
    });
  });
});

describe("Customer Service", () => {
  beforeEach(() => {
    resetStore();
  });

  describe("getCustomers", () => {
    it("should return all customers when no tier specified", () => {
      const customers = customerService.getCustomers();
      expect(customers.length).toBeGreaterThan(0);
    });

    it("should filter by tier when specified", () => {
      const premiumCustomers = customerService.getCustomers("premium");

      for (const customer of premiumCustomers) {
        expect(customer.tier).toBe("premium");
      }
    });
  });

  describe("getCustomerById", () => {
    it("should return customer when found", () => {
      const customer = customerService.getCustomerById("cust-1");
      expect(customer.id).toBe("cust-1");
    });

    it("should throw 404 when not found", () => {
      expect(() => customerService.getCustomerById("nonexistent")).toThrow(AppError);

      try {
        customerService.getCustomerById("nonexistent");
      } catch (error) {
        expect((error as AppError).statusCode).toBe(404);
      }
    });
  });

  describe("getCustomerOrderSummaries", () => {
    it("should return order summaries for customer", () => {
      const summaries = customerService.getCustomerOrderSummaries("cust-1");

      expect(Array.isArray(summaries)).toBe(true);
      for (const summary of summaries) {
        expect(summary).toHaveProperty("id");
        expect(summary).toHaveProperty("status");
        expect(summary).toHaveProperty("totalCents");
      }
    });

    it("should return empty array for customer with no orders", () => {
      // cust-4 should have minimal orders
      const summaries = customerService.getCustomerOrderSummaries("cust-999");
      expect(summaries).toEqual([]);
    });
  });

  describe("calculateCustomerStats", () => {
    it("should calculate correct stats from order summaries", () => {
      const orderSummaries = [
        { id: "o1", status: "pending" as const, totalCents: 1000 },
        { id: "o2", status: "paid" as const, totalCents: 2000 },
        { id: "o3", status: "paid" as const, totalCents: 3000 },
      ];

      const stats = customerService.calculateCustomerStats(orderSummaries);

      expect(stats.totalOrders).toBe(3);
      expect(stats.totalSpendCents).toBe(6000);
      expect(stats.ordersByStatus.pending).toBe(1);
      expect(stats.ordersByStatus.paid).toBe(2);
      expect(stats.ordersByStatus.shipped).toBe(0);
      expect(stats.ordersByStatus.cancelled).toBe(0);
    });

    it("should handle empty order summaries", () => {
      const stats = customerService.calculateCustomerStats([]);

      expect(stats.totalOrders).toBe(0);
      expect(stats.totalSpendCents).toBe(0);
      expect(stats.ordersByStatus.pending).toBe(0);
      expect(stats.ordersByStatus.paid).toBe(0);
      expect(stats.ordersByStatus.shipped).toBe(0);
      expect(stats.ordersByStatus.cancelled).toBe(0);
    });
  });

  describe("getCustomerSummary", () => {
    it("should return complete customer summary", () => {
      const summary = customerService.getCustomerSummary("cust-1");

      expect(summary.customer).toHaveProperty("id", "cust-1");
      expect(summary.orders).toBeInstanceOf(Array);
      expect(summary.stats).toHaveProperty("totalOrders");
      expect(summary.stats).toHaveProperty("totalSpendCents");
      expect(summary.stats).toHaveProperty("ordersByStatus");
    });

    it("should throw 404 for non-existent customer", () => {
      expect(() => customerService.getCustomerSummary("nonexistent")).toThrow(AppError);

      try {
        customerService.getCustomerSummary("nonexistent");
      } catch (error) {
        expect((error as AppError).statusCode).toBe(404);
      }
    });

    it("should have consistent stats with orders", () => {
      const summary = customerService.getCustomerSummary("cust-1");

      expect(summary.stats.totalOrders).toBe(summary.orders.length);

      const expectedTotal = summary.orders.reduce((sum, o) => sum + o.totalCents, 0);
      expect(summary.stats.totalSpendCents).toBe(expectedTotal);
    });
  });
});

