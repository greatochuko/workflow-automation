import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { UserType } from "@/types/user";
import { cookies } from "next/headers";

export async function getNonAdminUsers(): Promise<{
  data: UserType[];
  error: string | null;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      throw new Error("No token found");
    }

    const payload = await verifyToken(token);

    if (payload?.user.role !== "ADMIN") {
      throw new Error("User is not an Admin");
    }

    const users = await prisma.user.findMany({
      where: { role: { not: "ADMIN" } },
      include: { assignedClients: true, assignedFreelancers: true },
    });

    return { data: users as UserType[], error: null };
  } catch (err) {
    const error = err as Error;
    return { data: [], error: error.message };
  }
}
