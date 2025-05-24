"use server";

import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { FileWithPreview } from "@/types/video";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

type ProjectDataType = {
  title: string;
  description: string;
  videoType: string;
  uploadedFiles: FileWithPreview[];
  date: Date;
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
        title: projectData.title,
        description: projectData.description,
        scheduledDate: projectData.date,
        status: "IN_PROGRESS",
        videoType: projectData.videoType,
        createdById: payload.user.id,
        files: projectData.uploadedFiles.map((file) => ({
          id: file.metadata.id,
          name: file.file.name,
          description: file.metadata.description,
          url: "",
          type: file.file.type,
        })),
      },
    });

    revalidatePath("/");

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
