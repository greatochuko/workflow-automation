import { prisma } from "@/lib/prisma";
import { getTokenFromCookie } from "@/lib/utils/tokenHelper";
import { VideoScriptType } from "@/types/videoScript";

export async function getVideoScripts(clientId?: string): Promise<{
  data: VideoScriptType[];
  error: string | null;
}> {
  try {
    let userId = clientId;
    if (!userId) {
      const { payload } = await getTokenFromCookie();

      if (!payload?.user.id) {
        return { data: [], error: "Invalid token" };
      }
      userId = payload.user.id;
    }

    const videoScripts = await prisma.videoScript.findMany({
      where: { clientId: userId },
      orderBy: { createdAt: "desc" },
    });

    return {
      data: videoScripts as VideoScriptType[],
      error: null,
    };
  } catch (err) {
    const error = err as Error;
    return { data: [], error: error.message };
  }
}

export async function getVideoScriptById(scriptId: string) {
  try {
    const videoScript = await prisma.videoScript.findFirst({
      where: { id: scriptId },
    });

    return {
      data: videoScript as VideoScriptType,
      error: null,
    };
  } catch (err) {
    const error = err as Error;
    return { data: null, error: error.message };
  }
}
