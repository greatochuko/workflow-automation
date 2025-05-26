"use server";

import { comparePassword, hashPassword } from "@/lib/auth/hashPassword";
import { defaultKnowledgeBaseItems } from "@/lib/data/knowledgeBase";
import { prisma } from "@/lib/prisma";
import { getTokenFromCookie } from "@/lib/utils/tokenHelper";
import { getVideoTypes } from "@/services/videoTypeServices";
import { KnowledgeBaseItemType, type UserType } from "@/types/user";
import { revalidatePath } from "next/cache";

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
          userData.role === "CLIENT" ? defaultKnowledgeBaseItems : undefined,
        videoTypes: defaultVideoTypes,
      },
    });

    revalidatePath("/users");

    return { data: newUser, error: null };
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
