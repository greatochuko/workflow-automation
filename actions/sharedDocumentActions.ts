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
    console.log(`Unable to create shared document: ${error.message}`);
    return { data: null, error: "Server Error" };
  } finally {
    if (redirectUrl) redirect(redirectUrl);
  }
}
