import type { Product, ProductCategory } from "../../types/domain.js";
import { getProducts } from "../jsonStore.js";

/**
 * Repository for product data access
 * Provides typed functions for querying product data
 */

/**
 * Get all products
 * @returns Array of all products
 */
export function getAllProducts(): Product[] {
  // TODO: Implement this
  throw new Error("Not implemented yet");
}

/**
 * Get a product by ID
 * @param id - Product ID
 * @returns The product or undefined if not found
 */
export function getProductById(id: string): Product | undefined {
  // TODO: Implement this
  throw new Error("Not implemented yet");
}

/**
 * Get products by category
 * @param category - Product category to filter by
 * @returns Array of products in the specified category
 */
export function getProductsByCategory(category: ProductCategory): Product[] {
  // TODO: Implement this
  throw new Error("Not implemented yet");
}

/**
 * Check if a product exists
 * @param id - Product ID
 * @returns true if product exists, false otherwise
 */
export function productExists(id: string): boolean {
  // TODO: Implement this
  throw new Error("Not implemented yet");
}

/**
 * Get multiple products by their IDs
 * @param ids - Array of product IDs
 * @returns Map of product ID to Product (only includes found products)
 */
export function getProductsByIds(ids: string[]): Map<string, Product> {
  // TODO: Implement this
  // Return a Map where keys are product IDs and values are Product objects
  throw new Error("Not implemented yet");
}
