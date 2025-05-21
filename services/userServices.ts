import { prisma } from "@/lib/prisma";
import { UserType } from "@/types/user";

export async function getNonAdminUsers(): Promise<{
  data: UserType[];
  error: string | null;
}> {
  try {
    const users = await prisma.user.findMany({
      where: { role: { not: "ADMIN" } },
      include: { assignedClients: true, assignedFreelancers: true },
    });

    return { data: users as unknown as UserType[], error: null };
  } catch (err) {
    const error = err as Error;
    return { data: [], error: error.message };
  }
}

export async function getClients(): Promise<{
  data: UserType[];
  error: string | null;
}> {
  try {
    const users = await prisma.user.findMany({
      where: { role: "CLIENT" },
      include: { assignedClients: true, assignedFreelancers: true },
    });

    return { data: users as unknown as UserType[], error: null };
  } catch (err) {
    const error = err as Error;
    return { data: [], error: error.message };
  }
}
