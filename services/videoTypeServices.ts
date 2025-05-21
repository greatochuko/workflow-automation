import { prisma } from "@/lib/prisma";

export async function getVideoTypes() {
  try {
    const videoTypes = await prisma.videoType.findMany({
      where: { userid: null },
      orderBy: { createdAt: "desc" },
    });
    return { data: videoTypes, error: null };
  } catch (err) {
    const error = err as Error;
    return { data: [], error: error.message };
  }
}
