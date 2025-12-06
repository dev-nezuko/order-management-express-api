import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

/**
 * Central error handling middleware
 * Catches all errors and returns consistent JSON responses
 */

/**
 * Error response shape
 */
export interface ErrorResponse {
  error: string;
  details?: unknown;
}

/**
 * Express error handling middleware
 * 
 * Handles both AppError instances and unexpected errors:
 * - AppError: Uses statusCode and message from the error
 * - Other errors: Returns 500 Internal Server Error
 * 
 * Must be registered last in the middleware chain
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // TODO: Implement this
  // 1. Check if error is an AppError instance
  // 2. If AppError: respond with err.statusCode and { error: err.message, details?: err.details }
  // 3. If other error: respond with 500 and { error: "Internal Server Error" }
  // 4. Optionally log the error for debugging
  throw new Error("Not implemented yet");
}
