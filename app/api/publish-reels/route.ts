import { NextRequest, NextResponse } from "next/server";
import { getScheduledProjects } from "@/services/projectServices";
import { markProjectAsPosted } from "@/actions/projectActions";

const INSTAGRAM_GRAPH_BASE_URL = "https://graph.instagram.com";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
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
        const projectCaption = [
          project.captionData.hook,
          project.captionData.cta1,
          project.captionData.cta2,
          project.captionData.captionContent,
        ].join("\n\n");
        const projectMediaUrl =
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";

        // Step 1: Create container
        const createContainerUrl = `https://graph.instagram.com/${userInstagramId}/media?access_token=${userInstagramAccessToken}&video_url=${projectMediaUrl}&caption=${projectCaption}&media_type=REELS`;
        console.log(createContainerUrl);
        const createRes = await fetch(createContainerUrl, {
          method: "POST",
        });

        const createData = await createRes.json();
        console.log(createData);
        if (!createRes.ok || !createData.id) {
          throw new Error(
            `Container creation failed for project ${project.id}`,
          );
        }

        const creationId = createData.id;

        // Step 2: Poll for media readiness
        let status = "IN_PROGRESS";
        let retries = 0;
        while (status !== "FINISHED" && retries < 5) {
          await new Promise((res) => setTimeout(res, 5000));
          const statusRes = await fetch(
            `${INSTAGRAM_GRAPH_BASE_URL}/${creationId}?fields=status_code&access_token=${userInstagramAccessToken}`,
          );
          const statusData = await statusRes.json();
          status = statusData.status_code;
          retries++;
        }

        if (status !== "FINISHED") {
          throw new Error(
            "Media is not ready to be published. Timeout exceeded.",
          );
        }

        // Step 3: Publish the reel
        const formData = new FormData();
        formData.set("creation_id", creationId);
        const publishRes = await fetch(
          `${INSTAGRAM_GRAPH_BASE_URL}/${userInstagramId}/media_publish`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${userInstagramAccessToken}`,
            },
            body: formData,
          },
        );

        const publishData = await publishRes.json();
        if (!publishRes.ok || !publishData.id) {
          throw new Error("Reel publish failed");
        }

        await markProjectAsPosted(project.id, publishData.id);

        return {
          projectId: project.id,
          status: "success",
          reelId: publishData.id,
        };
      } catch (err) {
        const error = err as Error;
        console.error(`Failed for project ${project.id}:`, error.message);
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
