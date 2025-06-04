import { prisma } from "@/lib/prisma";
import { getTokenFromCookie } from "@/lib/utils/tokenHelper";
import { UserType } from "@/types/user";

export async function getSession(): Promise<{
  data: UserType | null;
  error: string | null;
}> {
  try {
    const { payload } = await getTokenFromCookie();

    if (!payload?.user.id) {
      return { data: null, error: "Invalid token" };
    }

    let user = await prisma.user.findUnique({
      where: { id: payload.user.id },
      include: {
        assignedClients: {
          select: {
            id: true,
            fullName: true,
          },
        },
        newsletterTemplates: true,
      },
    });

    if (user)
      user = {
        ...user,
        videoTypes: user.videoTypes.sort((a, b) => a.localeCompare(b)),
      };

    return { data: user as unknown as UserType | null, error: null };
  } catch (err) {
    const error = err as Error;
    return { data: null, error: error.message };
  }
}
