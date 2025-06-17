"use server";

import { comparePassword, hashPassword } from "@/lib/auth/hashPassword";
import { defaultKnowledgeBaseItems } from "@/lib/data/knowledgeBase";
import { prisma } from "@/lib/prisma";
import { getTokenFromCookie } from "@/lib/utils/tokenHelper";
import { getVideoTypes } from "@/services/videoTypeServices";
import {
  KnowledgeBaseItemType,
  YoutubeSettingType,
  type UserType,
} from "@/types/user";
import { revalidatePath } from "next/cache";
import { deleteProject } from "./projectActions";
import { deleteNewsletterTemplate } from "./newsletterActions";
import { deleteYoutubeContent } from "./youtubeContentActions";

export async function createUser(userData: {
  fullName: string;
  role: UserType["role"];
  profilePicture: string;
  email: string;
  password: string;
  companyName: string;
  location: string;
  industry: string;
  specialties: string[];
}) {
  try {
    const userExists = await prisma.user.findFirst({
      where: { email: userData.email },
    });
    if (userExists) {
      return { data: null, error: "User with email already exists" };
    }

    const hashedPassword = await hashPassword(userData.password);

    const { data: defaultVideoTypes } = await getVideoTypes();

    const newUser = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        knowledgeBase:
          userData.role === "CLIENT" ? defaultKnowledgeBaseItems : undefined,
        videoTypes: defaultVideoTypes,
      },
      include: {
        assignedClients: true,
        assignedFreelancers: true,
      },
    });

    return { data: newUser as unknown as UserType, error: null };
  } catch {
    return { data: null, error: "Server Error" };
  }
}

export async function updateUserProfile(userData: UserType) {
  try {
    const { payload } = await getTokenFromCookie();

    if (!payload?.user.id) {
      return { data: null, error: "Invalid token" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.user.id },
      data: {
        fullName: userData.fullName,
        email: userData.email,
        profilePicture: userData.profilePicture,
        companyName: userData.companyName,
        location: userData.location,
        industry: userData.industry,
        specialties: userData.specialties,
        certifications: userData.certifications,
        phoneNumber: userData.phoneNumber,
        website: userData.website,
        threads: userData.threads,
        instagram: userData.instagram,
        facebook: userData.facebook,
        twitter: userData.twitter,
        linkedin: userData.linkedin,
        youtube: userData.youtube,
        tiktok: userData.tiktok,
        snapchat: userData.snapchat,
      },
    });

    revalidatePath("/", "layout");

    return { data: updatedUser, error: null };
  } catch {
    return { data: null, error: "Server Error" };
  }
}

export async function changeUserPassword(
  oldPassword: string,
  newPassword: string,
) {
  try {
    const { payload } = await getTokenFromCookie();

    if (!payload?.user.id) {
      return { data: null, error: "Invalid token" };
    }

    const userToUpdate = await prisma.user.findFirst({
      where: { id: payload.user.id },
    });

    const passwordsMatch = await comparePassword(
      oldPassword,
      userToUpdate?.password || "",
    );

    if (!passwordsMatch) {
      return { data: null, error: "Current password is incorrect" };
    }

    const newHashedPassword = await hashPassword(newPassword);
    if (!newHashedPassword) {
      return { data: null, error: "Failed to hash new password" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.user.id },
      data: {
        password: newHashedPassword,
      },
    });

    revalidatePath("/", "layout");

    return { data: updatedUser, error: null };
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

export async function saveUserVideoScriptSettings(
  clientId: string,
  videoScriptExamples: string[],
) {
  try {
    await prisma.user.update({
      where: { id: clientId },
      data: {
        videoScriptExamples,
      },
    });
    revalidatePath("/settings");
    return { error: null };
  } catch {
    return { error: "Server Error: Unable to update user knowledge base" };
  }
}

export async function saveUserNewsletterSettings(
  clientId: string,
  newsletterSettings: {
    newsletterExamples: string[];
    newsLetterBasicInstructions: string;
    monthlyCredits: number;
  },
) {
  try {
    await prisma.user.update({
      where: { id: clientId },
      data: newsletterSettings,
    });
    revalidatePath("/settings");
    return { error: null };
  } catch {
    return { error: "Server Error: Unable to update user newsletter settings" };
  }
}

export async function saveYoutubeSettings(
  clientId: string,
  youtubeSettings: YoutubeSettingType,
) {
  try {
    await prisma.user.update({
      where: { id: clientId },
      data: { youtubeSettings },
    });
    revalidatePath("/settings");
    return { error: null };
  } catch {
    return { error: "Server Error: Unable to update user youtube settings" };
  }
}

export async function deleteUser(userId: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        projects: true,
        newsletterTemplates: true,
        videoScripts: true,
        youtubeContent: true,
      },
    });

    if (!user) {
      return { data: null, error: "Unable to delete user: Invalid user ID" };
    }

    const deletionPromises = [
      deleteYoutubeContent(user.youtubeContent.map((yc) => yc.id)),
      deleteNewsletterTemplate(user.newsletterTemplates.map((nt) => nt.id)),
      ...user.projects.map(async (project) => {
        const { data, error } = await deleteProject(project.id);
        if (error) {
          console.error(`Error deleting project ${project.title}`, error);
        }
        return data;
      }),
      deleteNewsletterTemplate(user.videoScripts.map((vs) => vs.id)),
    ];

    await Promise.all(deletionPromises);

    await prisma.user.delete({
      where: { id: userId },
    });

    return { error: null };
  } catch (err) {
    console.error(
      `Error deleting user with id ${userId}`,
      (err as Error).message,
    );
    return { error: "Server Error: Unable to delete user" };
  }
}
