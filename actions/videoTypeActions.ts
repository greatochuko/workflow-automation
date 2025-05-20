"use server";

import { verifyToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function createVideoType(name: string) {
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

    const newVideoType = await prisma.videoType.create({
      data: { name, createdById: payload.user.id },
    });
    return { data: newVideoType, error: null };
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  }
}

export async function updateVideoType(videoTypeId: string, name: string) {
  try {
    const updatedVideoType = await prisma.videoType.update({
      where: { id: videoTypeId },
      data: { name },
    });
    return { data: updatedVideoType, error: null };
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  }
}

export async function deleteVideoType(videoTypeId: string) {
  try {
    const deletedVideoType = await prisma.videoType.delete({
      where: { id: videoTypeId },
    });
    return { data: deletedVideoType, error: null };
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  }
}
