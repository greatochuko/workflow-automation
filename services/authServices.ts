import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { UserType } from "@/types/user";
import { cookies } from "next/headers";

export async function getSession(): Promise<{
  data: UserType | null;
  error: string | null;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { data: null, error: "No token found" };
    }

    const payload = await verifyToken(token);

    if (!payload?.user.id) {
      return { data: null, error: "Invalid token" };
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.user.id },
    });

    return { data: user as UserType, error: null };
  } catch (err) {
    const error = err as Error;
    return { data: null, error: error.message };
  }
}
