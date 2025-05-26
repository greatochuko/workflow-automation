"use server";

import { prisma } from "@/lib/prisma";
import { getTokenFromCookie } from "@/lib/utils/tokenHelper";

export async function addToDefaultVideoTypes(newVideoType: string) {
  try {
    await prisma.appSettings.update({
      where: { id: "default" },
      data: { defaultTypes: { push: newVideoType.toLowerCase() } },
    });

    return { error: null };
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  }
}

export async function updateDefaultVideoTypes(updatedVideoTypes: string[]) {
  try {
    await prisma.appSettings.update({
      where: { id: "default" },
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
    const { payload } = await getTokenFromCookie();

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
