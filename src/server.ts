import { app } from "./app.js";
import { env } from "./config/env.js";

/**
 * Start the HTTP server
 * This file is for manual running only - tests import app directly
 */

const port = env.PORT;

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
});

