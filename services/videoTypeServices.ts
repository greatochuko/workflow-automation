import { prisma } from "@/lib/prisma";

export async function getVideoTypes() {
  try {
    const videoTypes = await prisma.videoType.findMany();
    return { data: videoTypes, error: null };
  } catch (err) {
    const error = err as Error;
    return { data: [], error: error.message };
  }
}
