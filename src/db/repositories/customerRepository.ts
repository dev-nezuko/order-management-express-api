import type { Customer, CustomerTier } from "../../types/domain.js";
import { getCustomers } from "../jsonStore.js";

/**
 * Repository for customer data access
 * Provides typed functions for querying customer data
 */

/**
 * Get all customers
 * @returns Array of all customers
 */
export function getAllCustomers(): Customer[] {
  // TODO: Implement this
  throw new Error("Not implemented yet");
}

/**
 * Get a customer by ID
 * @param id - Customer ID
 * @returns The customer or undefined if not found
 */
export function getCustomerById(id: string): Customer | undefined {
  // TODO: Implement this
  throw new Error("Not implemented yet");
}

/**
 * Get customers by tier
 * @param tier - Customer tier to filter by
 * @returns Array of customers with the specified tier
 */
export function getCustomersByTier(tier: CustomerTier): Customer[] {
  // TODO: Implement this
  throw new Error("Not implemented yet");
}

/**
 * Check if a customer exists
 * @param id - Customer ID
 * @returns true if customer exists, false otherwise
 */
export function customerExists(id: string): boolean {
  // TODO: Implement this
  throw new Error("Not implemented yet");
}
