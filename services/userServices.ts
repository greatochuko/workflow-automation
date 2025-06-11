import { prisma } from "@/lib/prisma";
import { UserType } from "@/types/user";

export async function getUserById(id: string) {
  try {
    const user = (await prisma.user.findFirst({
      where: { id },
      include: {
        assignedClients: {
          select: {
            id: true,
            fullName: true,
          },
        },
        newsletterTemplates: true,
        videoScripts: true,
      },
    })) as unknown as UserType | null;

    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();
    const newsletterTemplatesCreatedThisMonth =
      user.newsletterTemplates?.filter((template, index, arr) => {
        const createdAt = new Date(template.createdAt);
        const isThisMonth =
          createdAt.getFullYear() === now.getFullYear() &&
          createdAt.getMonth() === now.getMonth();

        const isFirstForProject =
          arr.findIndex(
            (t) =>
              t.projectId === template.projectId &&
              new Date(t.createdAt).getFullYear() === now.getFullYear() &&
              new Date(t.createdAt).getMonth() === now.getMonth(),
          ) === index;

        return isThisMonth && isFirstForProject;
      }) ?? [];

    const sortedVideoTypes = user.videoTypes?.sort((a, b) =>
      a.localeCompare(b),
    );

    return {
      data: {
        ...user,
        videoTypes: sortedVideoTypes,
        creditsUsedThisMonth: newsletterTemplatesCreatedThisMonth.length,
      },
      error: null,
    };
  } catch (err) {
    const error = err as Error;
    return { data: null, error: error.message };
  }
}

export async function getNonAdminUsers(): Promise<{
  data: UserType[];
  error: string | null;
}> {
  try {
    const users = await prisma.user.findMany({
      where: { role: { not: "ADMIN" } },
      include: {
        assignedClients: true,
        assignedFreelancers: true,
      },
      orderBy: { createdAt: "desc" },
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
    let users = await prisma.user.findMany({
      where: { role: "CLIENT" },
      include: {
        assignedClients: true,
        assignedFreelancers: true,
      },
      orderBy: { createdAt: "desc" },
    });

    users = users.map((user) => ({
      ...user,
      videoTypes: user.videoTypes.sort((a, b) => a.localeCompare(b)),
    }));

    return { data: users as unknown as UserType[], error: null };
  } catch (err) {
    const error = err as Error;
    return { data: [], error: error.message };
  }
}
