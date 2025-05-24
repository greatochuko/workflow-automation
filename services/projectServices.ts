import { prisma } from "@/lib/prisma";

export async function getClientProjects(clientId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: { createdById: clientId },
    });

    return {
      data: projects,
      error: null,
    };
  } catch (err) {
    const error = err as Error;
    return { data: [], error: error.message };
  }
}
