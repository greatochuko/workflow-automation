import { NextRequest, NextResponse } from "next/server";
import { getScheduledProjects } from "@/services/projectServices";
import { markProjectAsPosted, rejectProject } from "@/actions/projectActions";

const INSTAGRAM_GRAPH_BASE_URL = "https://graph.instagram.com";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (token !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: projects } = await getScheduledProjects();

    if (projects.length < 1) {
      return NextResponse.json({ message: "No pending reels to publish." });
    }

    const publishTasks = projects.map(async (project) => {
      try {
        if (!project.createdBy.instagramAccount) {
          throw new Error(
            `User with ID ${project.createdBy.id} Instagram account not connected`,
          );
        }

        const userInstagramId =
          project.createdBy.instagramAccount.instagramUserId;
        const userInstagramAccessToken =
          project.createdBy.instagramAccount.accessToken;
        const projectCaption = project.captionData.captionContent;
        const projectMediaUrl = project.completedFile.url;

        if (!projectCaption) {
          throw new Error("Invalid project caption");
        }

        if (!projectMediaUrl) {
          throw new Error("Invalid video url");
        }

        const createContainerUrl = new URL(
          `/${userInstagramId}/media`,
          INSTAGRAM_GRAPH_BASE_URL,
        );
        createContainerUrl.searchParams.set("media_type", "REELS");
        createContainerUrl.searchParams.set("caption", projectCaption);
        createContainerUrl.searchParams.set("video_url", projectMediaUrl);
        createContainerUrl.searchParams.set(
          "access_token",
          userInstagramAccessToken,
        );
        const createRes = await fetch(createContainerUrl, {
          method: "POST",
        });

        const createData = await createRes.json();
        if (!createRes.ok || !createData.id) {
          throw new Error(
            `Container creation failed for project ${project.id}: ${createData.error?.message}`,
          );
        }

        const creationId = createData.id;

        // Step 2: Poll for media readiness
        let status = "IN_PROGRESS";
        let retries = 0;
        while (status !== "FINISHED" && retries < 4) {
          await new Promise((res) => setTimeout(res, 8000));
          const statusRes = await fetch(
            `${INSTAGRAM_GRAPH_BASE_URL}/${creationId}?fields=status_code&access_token=${userInstagramAccessToken}`,
          );
          const statusData = await statusRes.json();
          status = statusData.status_code;
          retries++;
          if (status === "ERROR") {
            break;
          }
        }

        if (status !== "FINISHED") {
          throw new Error(
            "Media is not ready to be published. Timeout exceeded.",
          );
        }

        // Step 3: Publish the reel
        const publishRes = await fetch(
          `${INSTAGRAM_GRAPH_BASE_URL}/${userInstagramId}/media_publish?creation_id=${creationId}`,
          {
            method: "POST",
            headers: {
              authorization: `Bearer ${userInstagramAccessToken}`,
            },
          },
        );

        const publishData = await publishRes.json();
        if (!publishRes.ok || !publishData.id) {
          throw new Error(
            `Reel publish failed for project ${project.id}: ${publishData.error?.message}`,
          );
        }

        await markProjectAsPosted(project.id, publishData.id);

        return {
          projectId: project.id,
          status: "success",
          reelId: publishData.id,
        };
      } catch (err) {
        const error = err as Error;
        await rejectProject(project.id, error.message);
        console.error(
          error.message ||
            `Project Publishing Failed for project ${project.id}:`,
        );
        return {
          projectId: project.id,
          status: "error",
          error: error.message,
        };
      }
    });

    const results = await Promise.all(publishTasks);
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
