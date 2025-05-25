"use server";

import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { ProjectType } from "@/types/project";
import { cookies } from "next/headers";
type ProjectFileType = {
  id: string;
  name: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  type: string;
};

type ProjectDataType = {
  title: string;
  description: string;
  scheduledDate: Date;
  videoType: string;
  files: ProjectFileType[];
};

export async function createProject(projectData: ProjectDataType) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { data: null, error: "No token found" };
    }

    const payload = await verifyToken(token);

    if (!payload?.user.id) {
      return { data: null, error: "Invalid token" };
    }

    const newProject = await prisma.project.create({
      data: {
        ...projectData,
        createdById: payload.user.id,
        status: "IN_PROGRESS",
      },
    });

    return { data: newProject, error: null };
  } catch {
    return { data: null, error: "Server Error" };
  }
}

export async function updateProjectDate(projectId: string, newDate: Date) {
  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { scheduledDate: newDate },
    });

    return { data: updatedProject, error: null };
  } catch {
    return { data: null, error: "Server Error" };
  }
}

export async function submitProjectFiles(
  projectId: string,
  completedFile: Omit<ProjectFileType, "description">,
) {
  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { submissionDate: new Date(), completedFile, status: "SUBMITTED" },
    });

    return { data: updatedProject as unknown as ProjectType, error: null };
  } catch {
    return { data: null, error: "Server Error" };
  }
}
