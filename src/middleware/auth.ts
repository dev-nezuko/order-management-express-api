import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

/**
 * Authentication middleware
 * Validates API key from x-api-key header
 */

/**
 * Express middleware to authenticate requests using API key
 * 
 * Checks for x-api-key header and compares against configured API_KEY
 * 
 * On success: calls next()
 * On failure: returns 401 { error: "Unauthorized" }
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // TODO: Implement this
  // 1. Get the x-api-key header from the request
  // 2. Compare against env.API_KEY
  // 3. If missing or invalid, respond with 401 and { error: "Unauthorized" }
  // 4. If valid, call next()
  throw new Error("Not implemented yet");
}
