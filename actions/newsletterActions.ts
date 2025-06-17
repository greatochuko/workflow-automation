"use server";

import { prisma } from "@/lib/prisma";
import { getTokenFromCookie } from "@/lib/utils/tokenHelper";
import { NewsletterTemplateType } from "@/types/newsletter";
import { ProjectType } from "@/types/project";
import OpenAI from "openai";

const openai = new OpenAI();

async function generateNewsletterTemplate(
  basicInstructions: string,
  examples: string[],
  projectCaptionData: ProjectType["captionData"],
  existingTemplate?: string,
) {
  try {
    const formattedExamples =
      examples && examples.length
        ? examples.map((ex, idx) => `Example ${idx + 1}:\n${ex}`).join("\n\n")
        : "None";

    const userContent = `
    ${
      existingTemplate
        ? `
      ${existingTemplate}
      
      Generate a variation of the template above with the instructions below
      `
        : ""
    }
  ${basicInstructions}

  ${examples.length ? `Here are some examples of successful emails:\n${formattedExamples}\n` : ""}

  Using the above criteria and examples, write an email based on the following Instagram caption data:

  Hook:
  ${projectCaptionData.hook}

  CTA #1:
  ${projectCaptionData.cta1}

  CTA #2:
  ${projectCaptionData.cta2}

  Caption Content:
  ${projectCaptionData.captionContent}
  `.trim();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
  You are a world-class email marketer. Your task is to repurpose high-performing Instagram content into effective, persuasive email copy.

  You craft messages that resonate with the reader by deeply understanding their pain points, goals, and desires. Your writing style is clear, concise, and compelling. You use persuasive language and emotional triggers that drive results — whether that’s clicks, replies, signups, or sales.

  You are excellent at:
  - Writing engaging subject lines and preheaders
  - Structuring emails for skimmability and clarity
  - Keyword optimization for email performance
  - Writing strong calls to action

  The output should be plain text.
  Do NOT include any commentary, footnotes, markdown e.g. **, or formatting explanations. Return only the final email content.
      `.trim(),
        },
        {
          role: "user",
          content: userContent,
        },
      ],
      temperature: 0.7,
    });

    const aiOutput = response.choices[0].message.content;

    return aiOutput || undefined;
  } catch (error) {
    console.error(
      "Error generating caption content:",
      (error as Error).message,
    );
    return undefined;
  }
}

export async function createNewsletterTemplate(
  projectId: string,
  existingTemplate?: string,
  userId?: string,
) {
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
      include: { newsletterTemplates: true },
    });

    if (!user) {
      return { data: null, error: "Invalid user ID. User not found." };
    }

    const project = (await prisma.project.findFirst({
      where: { id: projectId },
    })) as unknown as ProjectType;

    if (!project) {
      return { data: null, error: "Invalid project ID. Project not found." };
    }

    const aiContent = await generateNewsletterTemplate(
      user.newsLetterBasicInstructions,
      user.newsletterExamples,
      project.captionData,
      existingTemplate,
    );

    const newNewsletterTemplate = await prisma.newsletterTemplate.create({
      data: {
        content: aiContent || "",
        clientId: resolvedUserId,
        projectId,
      },
    });

    return {
      data: newNewsletterTemplate as unknown as NewsletterTemplateType,
      error: null,
    };
  } catch (err) {
    const error = err as Error;
    console.error("Error creating newsletter template: ", error.message);
    return { data: null, error: "Server Error" };
  }
}

export async function deleteNewsletterTemplate(newsletterIds: string[]) {
  try {
    await prisma.newsletterTemplate.deleteMany({
      where: { id: { in: newsletterIds } },
    });

    return { error: null };
  } catch {
    return { error: "Server Error" };
  }
}
