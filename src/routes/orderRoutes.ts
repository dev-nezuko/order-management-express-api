import { Router, type Request, type Response, type NextFunction } from "express";
import type { CreateOrderRequest, OrdersQueryParams, OrderStatus } from "../types/domain.js";
import * as orderService from "../services/orderService.js";

/**
 * Express router for /orders endpoints
 */

const router = Router();

/**
 * GET /orders
 * Returns paginated list of orders with optional filters
 * 
 * Query parameters:
 * - status: Filter by order status
 * - customerId: Filter by customer ID
 * - page: Page number (default: 1)
 * - pageSize: Items per page (default: 10)
 */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement this
  // 1. Parse query parameters (status, customerId, page, pageSize)
  // 2. Call orderService.getOrdersPaginated with parsed params
  // 3. Return JSON response with paginated data
  // 4. Wrap in try-catch and call next(error) on failure
  try {
    throw new Error("Not implemented yet");
  } catch (error) {
    next(error);
  }
});

/**
 * GET /orders/:id
 * Returns a fully hydrated order with customer and product details
 */
router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement this
  // 1. Get order ID from params
  // 2. Call orderService.getHydratedOrder
  // 3. Return JSON response with hydrated order
  // 4. Wrap in try-catch and call next(error) on failure
  try {
    throw new Error("Not implemented yet");
  } catch (error) {
    next(error);
  }
});

/**
 * POST /orders
 * Creates a new order
 * 
 * Request body:
 * - customerId: string
 * - lines: Array of { productId: string, quantity: number }
 */
router.post("/", (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement this
  // 1. Parse and validate request body as CreateOrderRequest
  // 2. Call orderService.createOrder
  // 3. Return 201 status with created hydrated order
  // 4. Wrap in try-catch and call next(error) on failure
  try {
    throw new Error("Not implemented yet");
  } catch (error) {
    next(error);
  }
});

export default router;
