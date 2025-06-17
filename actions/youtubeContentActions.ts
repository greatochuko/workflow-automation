"use server";

import { prisma } from "@/lib/prisma";
import { getTokenFromCookie } from "@/lib/utils/tokenHelper";
import { ProjectType } from "@/types/project";
import { YoutubeContentType } from "@/types/youtubeContent";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI();

const YoutubeContentResponse = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  thumbnailText: z.array(z.string()),
});

async function generateYoutubeContent(
  location: string,
  videoDetails: {
    hook: string;
    cta1: string;
    cta2: string;
    captionContent: string;
    script?: string;
  },
) {
  try {
    const userContent = `
      You are a content strategist helping generate high-performing YouTube Shorts metadata for a chiropractor based in ${location}.

      The following inputs have already been created for the video:
      - Hook: ${videoDetails.hook}
      - CTA 1: ${videoDetails.cta1}
      - CTA 2: ${videoDetails.cta2}
      - Caption: ${videoDetails.captionContent}
      ${videoDetails.script ? `- Script: ${videoDetails.script}` : ""}

      Using those inputs, generate the following YouTube Shorts metadata:

      Title
      - Between 40-70 characters
      - Includes at least one keyword: 'sports medicine', 'chiropractic care', '${location} chiropractor'
      - Uses one or more of: numbers, current year (2025), direct address ('you', 'your'), or emotionally engaging language
      - Relevant to common pain points (e.g., posture, sports injuries, back/neck pain)
      - Optimized for YouTube and Google SEO

      Description
      - Starts with a 100-character hook using primary keywords: 'chiropractor', 'sports medicine', '${location} chiropractic'
      - 2-3 short paragraphs covering:
        • Key benefit or insight from the script
        • Mention of the chiropractor's name, location, and specialties
        • Call-to-action based on CTA 1 or CTA 2
      - Ends with hashtags in this order:
        • #shorts
        • 3-5 relevant niche tags like #chiropractor #backpainrelief #sportsmed
        • A location-based tag: #${location}chiropractor
      - Total: under 200 words

      Tags
      - Return 5-7 optimized tags for YouTube SEO and Shorts discovery
      - Blend keyword, pain-point, and location tags

      Thumbnail Texts
      - Return 3-5 text ideas (4-6 words each) that would perform well as YouTube Shorts thumbnails
      - Must be attention-grabbing, keyword-aware, and draw curiosity

      Return only:
      - title
      - description
      - tags
      - thumbnail_texts
    `;

    const systemContent = `
      You are an expert content strategist and SEO specialist for local service businesses, especially in health and wellness fields like chiropractic care.
      You write compelling, keyword-optimized YouTube Shorts titles and descriptions that boost engagement and local discoverability.
      Your language is clear, natural, and emotionally resonant, tailored to both YouTube's algorithm and human readers.
      Prioritize relevance to chiropractic services, pain relief, and sports medicine.
      Always include the clini's location and specialties when applicable.
      Ensure all content sounds authentic, avoids clickbait, and matches what is delivered in the video.
      Follow all instructions exactly and return only the requested fields: title, description, tags (5-7), and thumbnail texts (3-5).
      Keep tone professional, friendly, and focused on delivering value to potential patients.
    `;

    const response = await openai.responses.parse({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: systemContent },
        { role: "user", content: userContent },
      ],
      text: {
        format: zodTextFormat(YoutubeContentResponse, "youtube_content"),
      },
    });

    return response.output_parsed;
  } catch (error) {
    console.error(
      "Error generating caption content:",
      (error as Error).message,
    );
    return undefined;
  }
}

export async function createYoutubeContent(projectId: string, userId?: string) {
  try {
    let resolvedUserId = userId;
    let payload;

    if (!resolvedUserId) {
      const tokenResult = await getTokenFromCookie();
      payload = tokenResult.payload;
      if (!payload?.user.id) {
        return { data: null, error: "Invalid token" };
      }
      resolvedUserId = payload.user.id;
    }

    const user = await prisma.user.findFirst({
      where: { id: resolvedUserId },
      include: { youtubeContent: true },
    });

    if (!user) {
      return { data: null, error: "Invalid user ID. User not found." };
    }

    const project = (await prisma.project.findFirst({
      where: { id: projectId },
      include: { videoScript: true },
    })) as ProjectType;

    if (!project) {
      return { data: null, error: "Invalid project ID. Project not found." };
    }

    const aiContent = await generateYoutubeContent(user.location, {
      ...project.captionData,
      script: project.videoScript?.description,
    });

    const newYoutubeContent = await prisma.youtubeContent.create({
      data: aiContent
        ? {
            ...aiContent,
            clientId: resolvedUserId,
            projectId,
          }
        : {
            title: "",
            description: "",
            tags: [""],
            thumbnailText: [""],
            clientId: resolvedUserId,
            projectId,
          },
    });

    return {
      data: newYoutubeContent as unknown as YoutubeContentType,
      error: null,
    };
  } catch (err) {
    const error = err as Error;
    console.error("Error creating youtube content: ", error.message);
    return { data: null, error: "Server Error" };
  }
}

export async function deleteYoutubeContent(id?: string) {
  try {
    if (!id) return { data: null, error: "Invalid Youtube Content ID" };
    const deletedYoutubeContent = await prisma.youtubeContent.delete({
      where: { id },
    });

    return { data: deletedYoutubeContent, error: null };
  } catch {
    return { data: null, error: "Server Error" };
  }
}
