import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { Customer, Product, Order } from "../types/domain.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * In-memory data store backed by JSON files
 * Loads data once at startup and provides typed access
 */

/** Path to the data directory */
const DATA_DIR = join(__dirname, "../..", "data");

/**
 * Load and parse a JSON file
 * @param filename - Name of the JSON file in the data directory
 */
function loadJsonFile<T>(filename: string): T[] {
  // TODO: Implement this
  // Read the JSON file from DATA_DIR and parse it
  // Return the parsed array
  throw new Error("Not implemented yet");
}

/** In-memory store for customers */
let customers: Customer[] = [];

/** In-memory store for products */
let products: Product[] = [];

/** In-memory store for orders */
let orders: Order[] = [];

/**
 * Initialize the data store by loading all JSON files
 * Call this once at application startup
 */
export function initializeStore(): void {
  // TODO: Implement this
  // Load customers.json, products.json, and orders.json into the in-memory arrays
  throw new Error("Not implemented yet");
}

/**
 * Get all customers from the store
 */
export function getCustomers(): Customer[] {
  // TODO: Implement this
  throw new Error("Not implemented yet");
}

/**
 * Get all products from the store
 */
export function getProducts(): Product[] {
  // TODO: Implement this
  throw new Error("Not implemented yet");
}

/**
 * Get all orders from the store
 */
export function getOrders(): Order[] {
  // TODO: Implement this
  throw new Error("Not implemented yet");
}

/**
 * Add a new order to the store (in-memory only)
 * @param order - The order to add
 */
export function addOrder(order: Order): void {
  // TODO: Implement this
  throw new Error("Not implemented yet");
}

/**
 * Reset the store to initial state (useful for testing)
 */
export function resetStore(): void {
  // TODO: Implement this
  // Reload all data from JSON files
  throw new Error("Not implemented yet");
}
