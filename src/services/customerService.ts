import type {
  Customer,
  CustomerSummary,
  CustomerStats,
  OrderSummary,
  CustomerTier,
  OrderStatus,
} from "../types/domain.js";
import { AppError } from "../errors/AppError.js";
import * as customerRepo from "../db/repositories/customerRepository.js";
import * as orderRepo from "../db/repositories/orderRepository.js";
import { calculateOrderTotal } from "./orderService.js";

/**
 * Service layer for customer business logic
 * Handles customer queries and summary aggregation
 */

/**
 * Get all customers, optionally filtered by tier
 * @param tier - Optional tier to filter by
 * @returns Array of customers
 */
export function getCustomers(tier?: CustomerTier): Customer[] {
  // TODO: Implement this
  // If tier is provided, filter by tier
  // Otherwise return all customers
  throw new Error("Not implemented yet");
}

/**
 * Get a customer by ID
 * @param id - Customer ID
 * @returns The customer
 * @throws AppError with 404 if not found
 */
export function getCustomerById(id: string): Customer {
  // TODO: Implement this
  // Get customer from repository
  // Throw 404 if not found
  throw new Error("Not implemented yet");
}

/**
 * Build order summaries for a customer
 * @param customerId - Customer ID
 * @returns Array of order summaries with id, status, and totalCents
 */
export function getCustomerOrderSummaries(customerId: string): OrderSummary[] {
  // TODO: Implement this
  // Get all orders for customer
  // For each order, calculate total and return summary
  throw new Error("Not implemented yet");
}

/**
 * Calculate customer statistics
 * @param orderSummaries - Array of order summaries
 * @returns Statistics object with totals and breakdown by status
 */
export function calculateCustomerStats(
  orderSummaries: OrderSummary[]
): CustomerStats {
  // TODO: Implement this
  // Calculate:
  // - totalOrders: number of orders
  // - totalSpendCents: sum of all order totals
  // - ordersByStatus: count of orders by status
  throw new Error("Not implemented yet");
}

/**
 * Get a full customer summary with orders and statistics
 * @param id - Customer ID
 * @returns Customer summary with customer info, orders, and stats
 * @throws AppError with 404 if customer not found
 */
export function getCustomerSummary(id: string): CustomerSummary {
  // TODO: Implement this
  // 1. Get customer (throw 404 if not found)
  // 2. Get order summaries for customer
  // 3. Calculate stats from order summaries
  // 4. Return complete summary
  throw new Error("Not implemented yet");
}
