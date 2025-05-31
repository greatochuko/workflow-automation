"use server";

import { prisma } from "@/lib/prisma";
import { getTokenFromCookie } from "@/lib/utils/tokenHelper";
import { ProjectFileType, ProjectType } from "@/types/project";
import { KnowledgeBaseItemType, UserType } from "@/types/user";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import crypto from "crypto";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/aws-s3";
import { signProjectFiles } from "@/services/projectServices";

type ProjectDataType = {
  title: string;
  description: string;
  scheduledDate: Date;
  videoType: string;
  files: ProjectFileType[];
};

const openai = new OpenAI();

const ProjectCTAResponse = z.object({
  hook: z.string(),
  cta1: z.string(),
  cta2: z.string(),
  captionContent: z.string(),
});

async function generateCaptionContent(
  projectData: { title: string; description: string; videoType: string },
  userKnowledgeBase: KnowledgeBaseItemType[],
) {
  try {
    const userContent = `
    Here is the Video Context below. Based on the video context, please help me create the Hook, CTA's and post Caption. Please make sure you follow the rules below and the previous examples from your knowledge base on how to create these in my tone of voice and following my framework. Thank you

            Title: ${projectData.title}
            Description: ${projectData.description}
            Video Type: ${projectData.videoType}

            Basic Instructions: ${userKnowledgeBase.find((kb) => kb.id === "basic")?.content}
            Objective: ${userKnowledgeBase.find((kb) => kb.id === "objective")?.content}
            Structure: ${userKnowledgeBase.find((kb) => kb.id === "structure")?.content}
            Additional information: ${userKnowledgeBase.find((kb) => kb.id === "additional")?.content}
            Examples: ${userKnowledgeBase.find((kb) => kb.id === "examples")?.content}

            Keep the same format you see in the examples i.e. spaces, paragraphs, new lines, e.t.c
            `;

    const response = await openai.responses.parse({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You are a creative social media assistant who writes engaging Instagram captions.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      text: {
        format: zodTextFormat(ProjectCTAResponse, "instagram_caption"),
      },
    });

    return response.output_parsed || undefined;
  } catch (error) {
    console.log("Error generating caption content:", (error as Error).message);
    return undefined;
  }
}

export async function createProject(projectData: ProjectDataType) {
  try {
    const { payload } = await getTokenFromCookie();

    if (!payload?.user.id) {
      return { data: null, error: "Invalid token" };
    }

    const user = (await prisma.user.findFirst({
      where: { id: payload.user.id },
    })) as unknown as UserType | null;

    if (!user) {
      return { data: null, error: "Invalid user ID. User not found." };
    }

    const captionData = await generateCaptionContent(
      projectData,
      user.knowledgeBase,
    );

    const newProject = (await prisma.project.create({
      data: {
        ...projectData,
        createdById: payload.user.id,
        status: "IN_PROGRESS",
        captionData,
      },
    })) as ProjectType;

    const signedProject = await signProjectFiles([newProject]);

    return { data: signedProject[0], error: null };
  } catch {
    return { data: null, error: "Server Error" };
  }
}

export async function getPresignedUrl(file: File) {
  try {
    const ext = file.name.split(".").pop();
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_"); // sanitize base name
    const randomSuffix = crypto.randomBytes(6).toString("hex"); // shorter, readable
    const fileName = `${baseName}_${randomSuffix}${ext ? `.${ext}` : ""}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      ContentType: file.type,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 }); // 1 min

    return { url: signedUrl, key: fileName };
  } catch {
    return { url: null, key: null };
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

export async function updateProjectDescription(
  projectId: string,
  newDescription: string,
) {
  try {
    const projectToUpdate = (await prisma.project.findFirst({
      where: { id: projectId },
    })) as ProjectType | null;

    if (!projectToUpdate) {
      return { data: null, error: "Invalid project ID. Project not found." };
    }

    const user = (await prisma.user.findFirst({
      where: { id: projectToUpdate.createdById },
    })) as UserType | null;

    if (!user) {
      return { data: null, error: "Invalid user ID. User not found." };
    }

    const captionData = await generateCaptionContent(
      {
        title: projectToUpdate.title,
        description: newDescription,
        videoType: projectToUpdate.videoType,
      },
      user.knowledgeBase,
    );

    const updatedProject = (await prisma.project.update({
      where: { id: projectId },
      data: captionData
        ? { captionData, description: newDescription }
        : { description: newDescription },
    })) as ProjectType;

    const signedProject = await signProjectFiles([updatedProject]);
    return { data: signedProject[0], error: null };
  } catch {
    return { data: null, error: "Server Error" };
  }
}

export async function deleteProject(projectId: string) {
  try {
    const deletedProject = (await prisma.project.delete({
      where: { id: projectId },
    })) as ProjectType;

    const deleteCommands = deletedProject.files.flatMap((file) => {
      return [
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: file.url,
        }),
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: file.thumbnailUrl,
        }),
      ];
    });

    try {
      await Promise.all(deleteCommands.map((cmd) => s3Client.send(cmd)));
    } catch (err) {
      console.error(
        "Error deleting some files from S3:",
        (err as Error).message,
      );
    }

    return { data: deletedProject, error: null };
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

export async function rejectProject(projectId: string, feedback: string) {
  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { feedback, status: "REJECTED" },
    });

    return { data: updatedProject as unknown as ProjectType, error: null };
  } catch {
    return { data: null, error: "Server Error" };
  }
}

export async function approveProject(projectId: string, feedback?: string) {
  try {
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { feedback, status: "APPROVED" },
    });

    return { data: updatedProject as unknown as ProjectType, error: null };
  } catch {
    return { data: null, error: "Server Error" };
  }
}
