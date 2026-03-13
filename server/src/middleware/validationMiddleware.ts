import type { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validateSignup = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").trim().notEmpty().withMessage("Phone is required"),
  body("shopName").trim().notEmpty().withMessage("Shop name is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

export const validateOrderCreation = [
  body("customerId").notEmpty().withMessage("customerId is required"),
  body("orderDetails").trim().notEmpty().withMessage("orderDetails is required"),
  body("deliveryDate").notEmpty().withMessage("deliveryDate is required"),
  body("totalAmount")
    .isFloat({ gt: 0 })
    .withMessage("totalAmount must be a positive number"),
  body("advancePaid")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("advancePaid must be non-negative")
];

export const validatePaymentCreation = [
  body("customerId").notEmpty().withMessage("customerId is required"),
  body("orderId").notEmpty().withMessage("orderId is required"),
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("amount must be a positive number"),
  body("method")
    .isIn(["cash", "upi", "card"])
    .withMessage("method must be one of cash, upi, card")
];

export function handleValidationErrors(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
    return;
  }

  res.status(400).json({
    error: "Validation failed",
    details: errors
      .array()
      .map((e) => ({ field: e.param, message: e.msg }))
  });
}

