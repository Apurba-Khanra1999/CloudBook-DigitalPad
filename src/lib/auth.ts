import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.STACK_SECRET_SERVER_KEY || "dev-secret";

if (!JWT_SECRET) {
  throw new Error("STACK_SECRET_SERVER_KEY environment variable is not set");
}

export type SessionPayload = {
  uid: number;
  email: string;
};

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}