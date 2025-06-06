"use server";

import { prisma } from "@/lib/prisma";
import { getTokenFromCookie } from "@/lib/utils/tokenHelper";
import { VideoScriptContentType, VideoScriptType } from "@/types/videoScript";
import { redirect } from "next/navigation";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const openai = new OpenAI();

const scriptResponse = z.object({
  hookLine: z.string(),
  body: z.string(),
  cta: z.string(),
});

async function generateScript(
  topic: string,
  videoDescription: string,
  durationInSeconds: number,
) {
  try {
    const userContent = `
      Video Topic: "${topic}"
      Video Description: "${videoDescription}"
      Duration: ${durationInSeconds}
      `.trim();

    const systemContent = `
      You are a world-class video scriptwriter assistant.
      Your task is to generate engaging and high-converting video scripts optimized for viewer retention, clarity, and emotional resonanc based on the video title, description and duration.
      Ensure the tone and pacing match the type of content and target audience.
      Keep the script concise, emotionally engaging, and structured for video storytelling.
      `.trim();

    const response = await openai.responses.parse({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: systemContent,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      text: { format: zodTextFormat(scriptResponse, "video_script") },
      temperature: 0.7,
    });

    return response.output_parsed || undefined;
  } catch (error) {
    console.error("Error generating script:", (error as Error).message);
    return undefined;
  }
}

export async function createVideoScript(
  topic: string,
  description: string,
  durationInSeconds: number,
) {
  let newScriptId;
  try {
    const { payload } = await getTokenFromCookie();

    if (!payload?.user.id) {
      return { data: null, error: "Invalid token" };
    }

    const generatedScript = await generateScript(
      topic,
      description,
      durationInSeconds,
    );

    if (!generatedScript) {
      return { data: null, error: "An Error occured generating script" };
    }

    const newScript = await prisma.videoScript.create({
      data: {
        topic,
        description,
        durationInSeconds,
        content: generatedScript,
        clientId: payload.user.id,
      },
    });

    newScriptId = newScript.id;
  } catch (err) {
    const error = err as Error;
    console.error("Error creating video script: ", error.message);
    return { error: "Server Error" };
  } finally {
    if (newScriptId) redirect(`/script-generator/${newScriptId}`);
  }
}

export async function saveVideoScript(
  scriptId: string,
  content: VideoScriptContentType,
) {
  let newScriptId;
  try {
    const updatedScript = await prisma.videoScript.update({
      where: { id: scriptId },
      data: {
        content,
        isSaved: true,
      },
    });

    return { data: updatedScript as VideoScriptType, error: null };
  } catch (err) {
    const error = err as Error;
    console.error("Error updating video script: ", error.message);
    return { data: null, error: "An error occured updating video script" };
  } finally {
    if (newScriptId) redirect(`/script-generator/${newScriptId}`);
  }
}
