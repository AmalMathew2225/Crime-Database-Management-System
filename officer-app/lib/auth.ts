import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    // In production, refuse to start with no secret
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET environment variable is not set. Refusing to sign tokens in production.");
    }
    // In development, warn loudly but allow
    console.warn("⚠️  WARNING: JWT_SECRET is not set. Using insecure dev-only fallback. Set JWT_SECRET in your .env.local file.");
    return "dev-secret-do-not-use-in-production";
  }
  return secret;
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: Record<string, any>, expiresIn = "7d") {
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, getJwtSecret()) as Record<string, any>;
  } catch (err) {
    return null;
  }
}
