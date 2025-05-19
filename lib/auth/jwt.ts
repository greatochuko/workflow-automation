import { User } from "@prisma/client";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret"
); // Ensure this is set in .env

type AuthTokenPayload = { id: string; role: User["role"] };

export async function signToken(payload: AuthTokenPayload) {
  return await new SignJWT({ user: payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as JWTPayload & { user: AuthTokenPayload };
  } catch (err) {
    console.log("Error verifying token:", (err as Error).message);
    return null;
  }
}
