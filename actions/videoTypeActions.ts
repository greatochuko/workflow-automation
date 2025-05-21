"use server";

import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function addToDefaultVideoTypes(newVideoType: string) {
  try {
    await prisma.appSettings.create({});
    return { error: null };
    const updatedSettings = await prisma.appSettings.updateManyAndReturn({
      data: { defaultTypes: { push: newVideoType.toLowerCase() } },
    });

    if (updatedSettings.length < 1) throw new Error("No settings updated");

    return { error: null };
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  }
}

export async function updateDefaultVideoTypes(updatedVideoTypes: string[]) {
  try {
    await prisma.appSettings.updateMany({
      data: { defaultTypes: updatedVideoTypes },
    });
    return { error: null };
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  }
}

export async function addVideoTypeToClient(
  clientId: string,
  videoType: string,
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { data: null, error: "No token found" };
    }

    const payload = await verifyToken(token);

    if (!payload?.user.id) {
      return { data: null, error: "Invalid token" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: clientId },
      data: { videoTypes: { push: videoType.toLowerCase() } },
      include: { assignedClients: true, assignedFreelancers: true },
    });

    return { data: updatedUser, error: null };
  } catch (err) {
    const error = err as Error;
    return { data: null, error: error.message };
  }
}

export async function updateClientVideoTypes(
  clientId: string,
  filteredVideoTypes: string[],
) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: clientId },
      data: { videoTypes: { set: filteredVideoTypes } },
    });

    return { data: updatedUser, error: null };
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  }
}
