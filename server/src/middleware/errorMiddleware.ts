import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";

interface HttpError extends Error {
  status?: number;
}

export const errorMiddleware: ErrorRequestHandler = (err: HttpError, _req, res, _next) => {
  // Validation errors (express-validator, custom)
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation error",
      details: (err as any).errors ?? undefined
    });
  }

  // MongoDB / Mongoose errors
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      error: "Database validation error",
      details: err.message
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      error: "Invalid ID format",
      details: err.message
    });
  }

  // Duplicate key
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyErr = err as any;
  if (anyErr?.code === 11000) {
    return res.status(409).json({
      error: "Duplicate key",
      details: anyErr.keyValue
    });
  }

  const status = typeof err?.status === "number" ? err.status : 500;
  const message =
    status >= 500
      ? "Internal Server Error"
      : String(err?.message ?? "Error");

  res.status(status).json({ error: message });
};

