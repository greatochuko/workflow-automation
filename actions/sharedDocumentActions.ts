"use server";

import { prisma } from "@/lib/prisma";
import { getTokenFromCookie } from "@/lib/utils/tokenHelper";
import { SharedDocumentType } from "@/types/sharedDocument";
import { revalidatePath } from "next/cache";

export async function createSharedDocument(
  title: string,
  content: string,
  clientId: string,
) {
  try {
    const { payload, error } = await getTokenFromCookie();
    if (!payload) throw new Error(error);

    const newSharedDocument = await prisma.sharedDocument.create({
      data: { title, content, createdById: payload.user.id, clientId },
    });

    return { data: newSharedDocument as SharedDocumentType, error: null };
  } catch (err) {
    const error = err as Error;
    console.error(`Unable to create shared document: ${error.message}`);
    return { data: null, error: "Server Error" };
  }
}

export async function updateSharedDocument(
  documentId: string,
  title: string,
  content: string,
  clientId: string,
) {
  try {
    const { payload, error } = await getTokenFromCookie();
    if (!payload) throw new Error(error);

    const updatedDocument = await prisma.sharedDocument.update({
      where: { id: documentId },
      data: { title, content, lastEditedById: payload.user.id, clientId },
    });

    revalidatePath("/", "layout");
    return { data: updatedDocument as SharedDocumentType, error: null };
  } catch (err) {
    const error = err as Error;
    console.error(`Unable to save shared document: ${error.message}`);
    return { data: null, error: "Server Error" };
  }
}

export async function deleteSharedDocument(id: string) {
  try {
    const { payload, error } = await getTokenFromCookie();
    if (!payload) throw new Error(error);

    const docToDelete = await prisma.sharedDocument.findFirst({
      where: { id },
    });

    if (docToDelete?.createdById !== payload.user.id) {
      return { error: "User Unauthorized" };
    }

    await prisma.sharedDocument.delete({
      where: { id },
    });

    return { error: null };
  } catch (err) {
    const error = err as Error;
    console.error(`Unable to delete shared document: ${error.message}`);
    return { error: "Server Error" };
  }
}
