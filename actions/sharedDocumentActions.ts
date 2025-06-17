"use server";

import { prisma } from "@/lib/prisma";
import { getTokenFromCookie } from "@/lib/utils/tokenHelper";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSharedDocument(title: string, content: string) {
  let redirectUrl = "";
  try {
    const { payload, error } = await getTokenFromCookie();
    if (!payload) throw new Error(error);

    const newSharedDocument = await prisma.sharedDocument.create({
      data: { title, content, createdById: payload.user.id },
    });

    redirectUrl = `/shared-documents/${newSharedDocument.id}`;
    revalidatePath("/", "layout");
  } catch (err) {
    const error = err as Error;
    console.error(`Unable to create shared document: ${error.message}`);
    return { data: null, error: "Server Error" };
  } finally {
    if (redirectUrl) redirect(redirectUrl);
  }
}

export async function updateSharedDocument(
  documentId: string,
  title: string,
  content: string,
) {
  try {
    const { payload, error } = await getTokenFromCookie();
    if (!payload) throw new Error(error);

    const updatedDocument = await prisma.sharedDocument.update({
      where: { id: documentId },
      data: { title, content, lastEditedById: payload.user.id },
    });

    revalidatePath("/", "layout");
    return { data: updatedDocument, error: null };
  } catch (err) {
    const error = err as Error;
    console.error(`Unable to save shared document: ${error.message}`);
    return { data: null, error: "Server Error" };
  }
}
