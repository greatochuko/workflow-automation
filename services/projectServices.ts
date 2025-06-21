import { s3Client } from "@/lib/aws-s3";
import { prisma } from "@/lib/prisma";
import { ProjectType } from "@/types/project";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

async function getFileUrl(fileKey: string, download: boolean = true) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileKey,
    ResponseContentDisposition: download
      ? 'attachment; filename="' + fileKey + '"'
      : undefined,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return signedUrl;
}

export async function signProjectFiles(
  projects: ProjectType[],
  download: boolean = true,
): Promise<ProjectType[]> {
  return Promise.all(
    projects.map(async (project) => {
      const fileResults = await Promise.allSettled(
        project.files.map(async (file) => {
          try {
            const signedUrl = await getFileUrl(file.url, download);
            const signedThumbnailUrl = await getFileUrl(
              file.thumbnailUrl,
              download,
            );
            return {
              ...file,
              url: signedUrl,
              thumbnailUrl: signedThumbnailUrl,
            };
          } catch {
            return {
              ...file,
              url: null,
              thumbnailUrl: null,
              error: true,
            };
          }
        }),
      );

      let signedCompletedFile = project.completedFile;
      if (signedCompletedFile) {
        try {
          const signedCompletedfileUrl = await getFileUrl(
            project.completedFile.url,
            download,
          );
          const signedCompletedThumbnailUrl = await getFileUrl(
            project.completedFile.thumbnailUrl,
            download,
          );
          signedCompletedFile = {
            ...signedCompletedFile,
            url: signedCompletedfileUrl,
            thumbnailUrl: signedCompletedThumbnailUrl,
          };
        } catch (err) {
          console.error(
            "Error getting the signed url for completed file: ",
            (err as Error).message,
          );
        }
      }

      const signedFiles = fileResults
        .filter(
          (
            res,
          ): res is PromiseFulfilledResult<{
            url: string;
            thumbnailUrl: string;
            id: string;
            name: string;
            description: string;
            type: string;
          }> => res.status === "fulfilled",
        )
        .map((res) => res.value);

      return {
        ...project,
        files: signedFiles,
        completedFile: signedCompletedFile,
      };
    }),
  );
}

export async function getClientProjects(clientId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: { createdById: clientId },
      orderBy: { createdAt: "desc" },
      include: { createdBy: true },
    });

    const signedProjects = await signProjectFiles(
      projects as unknown as ProjectType[],
    );

    return {
      data: signedProjects as ProjectType[],
      error: null,
    };
  } catch (err) {
    const error = err as Error;
    return { data: [], error: error.message };
  }
}

export async function getClientApprovedProjects(clientId?: string) {
  try {
    if (!clientId) throw new Error("Invalid client ID");
    const projects = (await prisma.project.findMany({
      where: { createdById: clientId, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      include: { newsletterTemplates: true, youtubeContent: true },
    })) as unknown as ProjectType[];

    const signedProjects = await signProjectFiles(projects);

    return {
      data: signedProjects as ProjectType[],
      error: null,
    };
  } catch (err) {
    const error = err as Error;
    return { data: [], error: error.message };
  }
}

export async function getFreelancerClientProjects(clientIds: string[]) {
  try {
    const projects = (await prisma.project.findMany({
      where: { createdById: { in: clientIds } },
      orderBy: { createdAt: "desc" },
      include: { createdBy: true },
    })) as unknown as ProjectType[];

    const signedProjects = await signProjectFiles(projects);

    return {
      data: signedProjects as ProjectType[],
      error: null,
    };
  } catch (err) {
    const error = err as Error;
    return { data: [], error: error.message };
  }
}

export async function getScheduledProjects() {
  try {
    const scheduledProjects = await prisma.project.findMany({
      where: {
        status: "APPROVED",
        publishStatus: "PENDING",
        scheduledDate: { lte: new Date(Date.now() + 10 * 60 * 1000) },
      },
      include: { createdBy: { select: { id: true, instagramAccount: true } } },
    });

    const signedScheduledProjects = await signProjectFiles(
      scheduledProjects as unknown as ProjectType[],
      false,
    );

    return { data: signedScheduledProjects, error: null };
  } catch (err) {
    const error = err as Error;
    return { data: [], error: error.message };
  }
}
