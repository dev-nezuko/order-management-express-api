import { Router, type Request, type Response, type NextFunction } from "express";
import type { CustomerTier } from "../types/domain.js";
import * as customerService from "../services/customerService.js";

/**
 * Express router for /customers endpoints
 */

const router = Router();

/**
 * GET /customers
 * Returns all customers, optionally filtered by tier
 * 
 * Query parameters:
 * - tier: Filter by customer tier ("standard" or "premium")
 */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement this
  // 1. Parse optional tier query parameter
  // 2. Call customerService.getCustomers with tier filter
  // 3. Return JSON response with array of customers
  // 4. Wrap in try-catch and call next(error) on failure
  try {
    throw new Error("Not implemented yet");
  } catch (error) {
    next(error);
  }
});

/**
 * GET /customers/:id/summary
 * Returns a customer summary with orders and statistics
 */
router.get("/:id/summary", (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement this
  // 1. Get customer ID from params
  // 2. Call customerService.getCustomerSummary
  // 3. Return JSON response with customer summary
  // 4. Wrap in try-catch and call next(error) on failure
  try {
    throw new Error("Not implemented yet");
  } catch (error) {
    next(error);
  }
});

export default router;
