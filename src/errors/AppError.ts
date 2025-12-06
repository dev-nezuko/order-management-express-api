/**
 * Custom application error class for handling business/validation errors
 * Use this class to throw errors with specific HTTP status codes
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  /**
   * Create a new AppError
   * @param statusCode - HTTP status code (e.g., 400, 404, 500)
   * @param message - Error message
   * @param details - Optional additional error details
   */
  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "AppError";

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a 400 Bad Request error
   */
  static badRequest(message: string, details?: unknown): AppError {
    return new AppError(400, message, details);
  }

  /**
   * Create a 401 Unauthorized error
   */
  static unauthorized(message: string = "Unauthorized"): AppError {
    return new AppError(401, message);
  }

  /**
   * Create a 404 Not Found error
   */
  static notFound(message: string): AppError {
    return new AppError(404, message);
  }

  /**
   * Create a 500 Internal Server Error
   */
  static internal(message: string = "Internal Server Error"): AppError {
    return new AppError(500, message);
  }
}

