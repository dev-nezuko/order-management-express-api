import type { Request, Response, NextFunction } from "express";

/**
 * Request logging middleware
 * Logs method, path, and response status
 */

/**
 * Express middleware to log incoming requests
 * 
 * Logs: METHOD PATH -> STATUS
 * Example: GET /orders -> 200
 */
export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // TODO: Implement this
  // 1. Capture the start time
  // 2. Use res.on("finish", ...) to log after response is sent
  // 3. Log format: "METHOD PATH -> STATUS" (e.g., "GET /orders -> 200")
  // 4. Call next()
  throw new Error("Not implemented yet");
}
