import { prisma } from "@/lib/prisma";

export async function getVideoTypes() {
  try {
    const appSettings = await prisma.appSettings.findFirst();

    if (!appSettings) return { data: [], error: "App settings not found!" };

    return {
      data: [...appSettings.defaultTypes].sort((a, b) => a.localeCompare(b)),
      error: null,
    };
  } catch (err) {
    const error = err as Error;
    return { data: [], error: error.message };
  }
}
