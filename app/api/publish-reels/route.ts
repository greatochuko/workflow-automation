import { NextRequest, NextResponse } from "next/server";
import { getScheduledProjects } from "@/services/projectServices";
import { markProjectAsPosted, rejectProject } from "@/actions/projectActions";
import { prisma } from "@/lib/prisma";

const INSTAGRAM_GRAPH_BASE_URL = "https://graph.instagram.com";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (token !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    const { data: projects } = await getScheduledProjects();

    if (projects.length < 1) {
      return NextResponse.json({
        message: "No scheduled reels in the next 10 minutes.",
      });
    }

    const tasks = projects.map(async (project) => {
      const isDue =
        project.instagramContainerId && new Date(project.scheduledDate) <= now;
      const accessToken = project.createdBy.instagramAccount?.accessToken;
      const userId = project.createdBy.instagramAccount?.instagramUserId;
      const caption = project.captionData.captionContent;
      const mediaUrl = project.completedFile.url;

      if (!userId || !accessToken || !caption || !mediaUrl) {
        await rejectProject(
          project.id,
          "Missing Instagram credentials, caption, or media.",
        );
        return {
          projectId: project.id,
          status: "error",
          error: "Missing data",
        };
      }

      try {
        // Create container if not already created
        if (!project.instagramContainerId) {
          const containerUrl = new URL(
            `/${userId}/media`,
            INSTAGRAM_GRAPH_BASE_URL,
          );
          containerUrl.searchParams.set("media_type", "REELS");
          containerUrl.searchParams.set("caption", caption);
          containerUrl.searchParams.set("video_url", mediaUrl);
          containerUrl.searchParams.set("access_token", accessToken);

          const res = await fetch(containerUrl, { method: "POST" });
          const json = await res.json();

          if (!res.ok || !json.id) {
            throw new Error(
              `Failed to create container: ${json.error?.message}`,
            );
          }

          // Save containerId to DB
          await prisma.project.update({
            where: { id: project.id },
            data: { instagramContainerId: json.id },
          });

          return {
            projectId: project.id,
            status: "container_created",
            containerId: json.id,
          };
        }

        // If due, poll and publish
        if (isDue) {
          let status = "IN_PROGRESS";
          let retries = 0;

          while (status !== "FINISHED" && retries < 5) {
            if (retries >= 1) await new Promise((res) => setTimeout(res, 5000));

            const pollRes = await fetch(
              `${INSTAGRAM_GRAPH_BASE_URL}/${project.instagramContainerId}?fields=status_code&access_token=${accessToken}`,
            );
            const pollData = await pollRes.json();
            status = pollData.status_code;
            retries++;
            if (status === "ERROR") break;
          }

          if (status !== "FINISHED")
            throw new Error("Media not ready for publish");

          const publishRes = await fetch(
            `${INSTAGRAM_GRAPH_BASE_URL}/${userId}/media_publish?creation_id=${project.instagramContainerId}`,
            {
              method: "POST",
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            },
          );

          const publishData = await publishRes.json();
          if (!publishRes.ok || !publishData.id) {
            throw new Error(`Publish failed: ${publishData.error?.message}`);
          }

          await markProjectAsPosted(project.id, publishData.id);
          return {
            projectId: project.id,
            status: "published",
            reelId: publishData.id,
          };
        }

        return {
          projectId: project.id,
          status: "container_exists_waiting_for_publish",
        };
      } catch (err) {
        const error = err as Error;
        await rejectProject(project.id, error.message);
        console.error("Project Failed:", error.message);
        return { projectId: project.id, status: "error", error: error.message };
      }
    });

    const start = Date.now();

    const results = await Promise.all(tasks);

    const end = Date.now();
    console.log(`Duration: ${end - start}ms`);

    return NextResponse.json({ results });
  } catch (err) {
    const error = err as Error;
    console.error("Unexpected error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
