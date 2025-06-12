import { NextRequest, NextResponse } from "next/server";
import { getScheduledProjects } from "@/services/projectServices";
import { markProjectAsPosted } from "@/actions/projectActions";

const FACEBOOK_GRAPH_BASE_URL = "https://graph.facebook.com/v19.0";

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
        if (!project.createdBy.facebookAuth) {
          throw new Error(
            `User "${project.createdBy.fullName}" Instagram account not connected`,
          );
        }

        const userInstagramId =
          project.createdBy.facebookAuth.instagram_user_id;
        const userFacebookAccessToken =
          project.createdBy.facebookAuth.access_token;
        const projectCaption = [
          project.captionData.hook,
          project.captionData.cta1,
          project.captionData.cta2,
          project.captionData.captionContent,
        ].join("\n\n");

        // Step 1: Create container
        const createRes = await fetch(
          `${FACEBOOK_GRAPH_BASE_URL}/${userInstagramId}/media`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              media_type: "REELS",
              video_url:
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", // Replace with: project.completedFile.url
              caption: projectCaption,
              access_token: userFacebookAccessToken,
            }),
          },
        );

        const createData = await createRes.json();
        if (!createRes.ok || !createData.id) {
          throw new Error("Container creation failed");
        }

        const creationId = createData.id;

        // Step 2: Poll for media readiness
        let status = "IN_PROGRESS";
        let retries = 0;
        while (status !== "FINISHED" && retries < 5) {
          await new Promise((res) => setTimeout(res, 5000));
          const statusRes = await fetch(
            `${FACEBOOK_GRAPH_BASE_URL}/${creationId}?fields=status_code&access_token=${userFacebookAccessToken}`,
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
        const publishRes = await fetch(
          `${FACEBOOK_GRAPH_BASE_URL}/${userInstagramId}/media_publish`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              creation_id: creationId,
              access_token: userFacebookAccessToken,
            }),
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
