"use server";

import { hashPassword } from "@/lib/auth/hashPassword";
import { prisma } from "@/lib/prisma";
import { getVideoTypes } from "@/services/videoTypeServices";
import { KnowledgeBaseItemType, type UserType } from "@/types/user";
import { revalidatePath } from "next/cache";

const DEFAULT_KNOWLEDGE_BASE_ITEMS = [
  {
    id: "voice",
    title: "Brand Voice & Tone",
    content:
      "Friendly, professional, and approachable. Use conversational language that avoids jargon.",
  },
  {
    id: "products",
    title: "Product/Service Descriptions",
    content:
      "Our software helps businesses streamline their workflow and increase productivity. Focus on time-saving features and user-friendly interface.",
  },
  {
    id: "pillars",
    title: "Messaging Pillars",
    content: "1. Efficiency\n2. Reliability\n3. Support\n4. Innovation",
  },
  {
    id: "objections",
    title: "Objections/Pain Points",
    content:
      '1. "It\'s too expensive" - Focus on ROI and long-term value\n2. "It\'s too complicated" - Emphasize ease of use and training',
  },
  {
    id: "cta",
    title: "CTA Library",
    content:
      '1. "Start your free trial today"\n2. "Book a demo"\n3. "Join thousands of satisfied customers"\n4. "See how it works in 2 minutes"',
  },
  {
    id: "keywords",
    title: "Keywords/Themes",
    content:
      "productivity, efficiency, time-saving, automation, workflow, business solution",
  },
];

export async function createUser(userData: {
  fullName: string;
  role: UserType["role"];
  profilePicture: string;
  email: string;
  password: string;
  companyName: string;
  specialties: string[];
}) {
  try {
    const hashedPassword = await hashPassword(userData.password);

    const { data } = await getVideoTypes();

    const newUser = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        knowledgeBase:
          userData.role === "CLIENT" ? DEFAULT_KNOWLEDGE_BASE_ITEMS : undefined,
        videoTypes:
          userData.role === "CLIENT"
            ? {
                createMany: {
                  data: data.map((vt) => ({
                    name: vt.name,
                    createdById: vt.createdById,
                  })),
                },
              }
            : undefined,
      },
    });

    revalidatePath("/users");

    return { data: newUser, error: null };
  } catch {
    return { data: null, error: "Server Error" };
  }
}

export async function toggleAssignClientToFreelancer(
  freelancerId: string,
  clientId: string,
) {
  try {
    const userToUpdate = await prisma.user.findFirst({
      where: { id: freelancerId, role: "FREELANCER" },
      include: { assignedClients: true, assignedFreelancers: true },
    });
    if (!userToUpdate) throw new Error("Invalid freelancer ID");

    let updatedUser;
    if (userToUpdate.assignedClients.some((client) => client.id === clientId)) {
      updatedUser = await prisma.user.update({
        where: { id: freelancerId, role: "FREELANCER" },
        data: {
          assignedClients: {
            disconnect: { id: clientId },
          },
        },
      });
    } else {
      updatedUser = await prisma.user.update({
        where: { id: freelancerId, role: "FREELANCER" },
        data: {
          assignedClients: {
            connect: { id: clientId },
          },
        },
      });
    }

    revalidatePath("/users");

    return { data: updatedUser, error: null };
  } catch {
    return { data: null, error: "Server Error" };
  }
}

export async function toggleAssignFreelancerToClient(
  clientId: string,
  freelancerId: string,
) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: clientId, role: "CLIENT" },
      data: {
        assignedFreelancers: {
          set: [],
          connect: freelancerId ? { id: freelancerId } : undefined,
        },
      },
    });
    revalidatePath("/users");

    return { data: updatedUser, error: null };
  } catch {
    return { data: null, error: "Server Error" };
  }
}

export async function saveUserKnowledgeBase(
  clientId: string,
  knowledgeBase: KnowledgeBaseItemType[],
) {
  try {
    await prisma.user.update({
      where: { id: clientId },
      data: { knowledgeBase },
    });
    revalidatePath("/settings");
    return { error: null };
  } catch {
    return { error: "Server Error: Unable to update user knowledge base" };
  }
}
