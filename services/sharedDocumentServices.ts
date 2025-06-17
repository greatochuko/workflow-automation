import { prisma } from "@/lib/prisma";
import { getTokenFromCookie } from "@/lib/utils/tokenHelper";
import { getFreelancerClients } from "./userServices";

export async function getSharedDocuments() {
  try {
    const { payload, error } = await getTokenFromCookie();
    if (!payload) throw new Error(error);

    if (payload.user.role === "CLIENT") {
      const sharedDocuments = await prisma.sharedDocument.findMany({
        where: { createdById: payload.user.id },
      });

      return { data: sharedDocuments, error: null };
    } else if (payload.user.role === "FREELANCER") {
      const { data: clients } = await getFreelancerClients(payload.user.id);

      const sharedDocuments = await prisma.sharedDocument.findMany({
        where: { createdById: { in: clients.map((cl) => cl.id) } },
      });

      return { data: sharedDocuments, error: null };
    } else {
      throw new Error("Admin do not have access to shared documents");
    }
  } catch (err) {
    const error = err as Error;
    console.log(`Unable to create shared document: ${error.message}`);
    return { data: [], error: "Server Error" };
  }
}
