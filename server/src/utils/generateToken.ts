import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
  shopName: string;
}

const TOKEN_EXPIRES_IN = "7d";

export function generateToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(payload, secret, { expiresIn: TOKEN_EXPIRES_IN });
}

