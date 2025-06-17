import { prisma } from "@/lib/prisma";
import { getTokenFromCookie } from "@/lib/utils/tokenHelper";
import { getFreelancerClients } from "./userServices";
import { SharedDocumentType } from "@/types/sharedDocument";

export async function getSharedDocuments() {
  try {
    const { payload, error } = await getTokenFromCookie();
    if (!payload) throw new Error(error);

    if (payload.user.role === "CLIENT") {
      const sharedDocuments = await prisma.sharedDocument.findMany({
        where: { createdById: payload.user.id },
      });

      return { data: sharedDocuments as SharedDocumentType[], error: null };
    } else if (payload.user.role === "FREELANCER") {
      const { data: clients } = await getFreelancerClients(payload.user.id);

      const sharedDocuments = await prisma.sharedDocument.findMany({
        where: { createdById: { in: clients.map((cl) => cl.id) } },
      });

      return { data: sharedDocuments as SharedDocumentType[], error: null };
    } else {
      throw new Error("Admin do not have access to shared documents");
    }
  } catch (err) {
    const error = err as Error;
    console.error(`Unable to create shared document: ${error.message}`);
    return { data: [], error: "Server Error" };
  }
}

export async function getSharedDocumentById(id: string) {
  try {
    const { payload, error } = await getTokenFromCookie();
    if (!payload) throw new Error(error);

    const sharedDocument = await prisma.sharedDocument.findFirst({
      where: { id },
      include: { lastEditedBy: true },
    });

    return { data: sharedDocument as SharedDocumentType, error: null };
  } catch (err) {
    const error = err as Error;
    console.error(`Unable to fetch shared document: ${error.message}`);
    return { data: null, error: "Server Error" };
  }
}
