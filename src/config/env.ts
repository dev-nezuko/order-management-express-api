/**
 * Environment configuration helper
 * Provides typed access to environment variables with defaults
 */

export interface EnvConfig {
  PORT: number;
  API_KEY: string;
  NODE_ENV: string;
}

/**
 * Get a string environment variable with optional default
 * @param key - Environment variable name
 * @param defaultValue - Default value if not set
 */
export function getEnvString(key: string, defaultValue: string): string {
  // TODO: Implement this
  // Return the environment variable value or the default
  throw new Error("Not implemented yet");
}

/**
 * Get a number environment variable with optional default
 * @param key - Environment variable name
 * @param defaultValue - Default value if not set
 */
export function getEnvNumber(key: string, defaultValue: number): number {
  // TODO: Implement this
  // Parse the environment variable as a number, return default if not set or invalid
  throw new Error("Not implemented yet");
}

/**
 * Application environment configuration
 * Reads from environment variables with sensible defaults
 */
export const env: EnvConfig = {
  get PORT(): number {
    // TODO: Implement this - return port from environment or default 3000
    throw new Error("Not implemented yet");
  },
  get API_KEY(): string {
    // TODO: Implement this - return API key from environment or default "test-key"
    throw new Error("Not implemented yet");
  },
  get NODE_ENV(): string {
    // TODO: Implement this - return NODE_ENV from environment or default "development"
    throw new Error("Not implemented yet");
  },
};
