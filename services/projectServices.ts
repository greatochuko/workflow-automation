import { prisma } from "@/lib/prisma";
import { ProjectType } from "@/types/project";

export async function getClientProjects(clientId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: { createdById: clientId },
    });

    return {
      data: projects as ProjectType[],
      error: null,
    };
  } catch (err) {
    const error = err as Error;
    return { data: [], error: error.message };
  }
}

export async function getFreelancerClientProjects(clientIds: string[]) {
  try {
    const projects = await prisma.project.findMany({
      where: { createdById: { in: clientIds } },
    });

    return {
      data: projects as ProjectType[],
      error: null,
    };
  } catch (err) {
    const error = err as Error;
    return { data: [], error: error.message };
  }
}
