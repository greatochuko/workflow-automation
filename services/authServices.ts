import { prisma } from "@/lib/prisma";
import { getTokenFromCookie } from "@/lib/utils/tokenHelper";
import { UserType } from "@/types/user";

export async function getSession(): Promise<{
  data: (UserType & { creditsUsedThisMonth: number }) | null;
  error: string | null;
}> {
  try {
    const token = await getTokenFromCookie();
    const userId = token?.payload?.user?.id;

    if (!userId) {
      return { data: null, error: "Invalid token" };
    }

    const user = (await prisma.user.findUnique({
      where: { id: userId },
      include: {
        assignedClients: {
          select: {
            id: true,
            fullName: true,
          },
        },
        newsletterTemplates: true,
      },
    })) as UserType | null;

    if (!user) {
      return { data: null, error: "User not found" };
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
    const error = err instanceof Error ? err : new Error("Unknown error");
    return { data: null, error: error.message };
  }
}
