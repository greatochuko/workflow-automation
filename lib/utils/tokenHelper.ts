import { cookies } from "next/headers";
import { verifyToken } from "../auth/jwt";

export async function getTokenFromCookie() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      throw new Error("No token found");
    }

    const payload = await verifyToken(token);
    if (!payload?.user.id) {
      throw new Error("Invalid token");
    }
    return { payload, error: null };
  } catch (err) {
    const error = err as Error;
    return {
      payload: null,
      error: error.message || "Error getting token from cookie",
    };
  }
}
