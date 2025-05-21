"use server";

import { hashPassword } from "@/lib/auth/hashPassword";
import { prisma } from "@/lib/prisma";
import { getVideoTypes } from "@/services/videoTypeServices";
import { KnowledgeBaseItemType, type UserType } from "@/types/user";
import { revalidatePath } from "next/cache";

const DEFAULT_KNOWLEDGE_BASE_ITEMS = [
  {
    id: "basic",
    title: "Basic Instructions",
    content:
      "Include any fundamental guidelines or instructions for content creation here.",
  },
  {
    id: "objective",
    title: "Objective",
    content: "Define the primary goals and purpose of the content.",
  },
  {
    id: "structure",
    title: "Structure",
    content: "Outline how the content should be organized and formatted.",
  },
  {
    id: "additional",
    title: "Additional Information",
    content:
      "Any supplementary details or context that would be helpful for content creation.",
  },
  {
    id: "examples",
    title: "Examples",
    content:
      "Provide sample content or references that demonstrate the desired output.",
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

    const { data: defaultVideoTypes } = await getVideoTypes();

    const newUser = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        knowledgeBase:
          userData.role === "CLIENT" ? DEFAULT_KNOWLEDGE_BASE_ITEMS : undefined,
        videoTypes: defaultVideoTypes,
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
