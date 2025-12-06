import express, { type Express } from "express";
import { initializeStore } from "./db/jsonStore.js";
import { loggerMiddleware } from "./middleware/logger.js";
import { authMiddleware } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import orderRoutes from "./routes/orderRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

/**
 * Creates and configures the Express application
 */
export function createApp(): Express {
  // Initialize the JSON data store
  initializeStore();

  const app = express();

  // TODO: Configure middleware and routes
  // 1. Add JSON body parser middleware (express.json())
  // 2. Add logger middleware (global)
  // 3. Mount order routes at /orders with auth middleware
  // 4. Mount customer routes at /customers (no auth required)
  // 5. Add error handler middleware (must be last)

  // Hint: For protected routes, you can use:
  // app.use("/orders", authMiddleware, orderRoutes);

  throw new Error("Not implemented yet");

  return app;
}

// Create the app instance for testing and server
export const app = createApp();
