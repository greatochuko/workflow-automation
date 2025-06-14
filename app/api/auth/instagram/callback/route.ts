import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const ORIGIN = process.env.ORIGIN!;
const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID!;
const INSTAGRAM_REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI!;
const INSTAGRAM_CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET!;
const INSTAGRAM_GRAPH_BASE_URL = "https://graph.instagram.com";
const INSTAGRAM_API_BASE_URL = "https://api.instagram.com";

type IgUserIdResponseType =
  | {
      data: { id: string };
      error: null;
    }
  | { data: null; error: string };

async function getInstagramUserId(
  token: string,
): Promise<IgUserIdResponseType> {
  try {
    const res = await fetch(
      `${INSTAGRAM_GRAPH_BASE_URL}/me?access_token=${token}`,
    );

    const igUserIdData = await res.json();

    if (!res.ok) throw new Error(igUserIdData.error.message);

    return { data: igUserIdData, error: null };
  } catch (err) {
    const error = err as Error;
    return { data: null, error: error.message };
  }
}

type ShortTokenResponseType =
  | {
      data: { access_token: string; user_id: string; permissions: string[] };
      error: null;
    }
  | { data: null; error: string };

async function getShortLivedToken(
  code: string,
): Promise<ShortTokenResponseType> {
  try {
    const formData = new FormData();
    Object.entries({
      client_id: INSTAGRAM_CLIENT_ID,
      client_secret: INSTAGRAM_CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: INSTAGRAM_REDIRECT_URI,
      code,
    }).map(([key, value]) => formData.set(key, value));

    const res = await fetch(`${INSTAGRAM_API_BASE_URL}/oauth/access_token`, {
      method: "POST",
      body: formData,
    });

    const shortTokenData = await res.json();

    if (!res.ok) throw new Error(shortTokenData.error_message);

    return { data: shortTokenData, error: null };
  } catch (err) {
    const error = err as Error;
    return { data: null, error: error.message };
  }
}

type LongTokenResponseType =
  | {
      data: { access_token: string; token_type: string; expires_in: number };
      error: null;
    }
  | { data: null; error: string };

async function getLongLivedToken(
  short_access_token: string,
): Promise<LongTokenResponseType> {
  try {
    const url = new URL("/access_token", INSTAGRAM_GRAPH_BASE_URL);
    url.searchParams.set("client_secret", INSTAGRAM_CLIENT_SECRET);
    url.searchParams.set("grant_type", "ig_exchange_token");
    url.searchParams.set("access_token", short_access_token);

    const res = await fetch(url);

    const longTokenData = await res.json();

    if (!res.ok) throw new Error(longTokenData.error.message);

    return { data: longTokenData, error: null };
  } catch (err) {
    const error = err as Error;
    return { data: null, error: error.message };
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");
    const code = searchParams.get("code");

    if (!state) throw new Error("Invalid state");
    if (!code) throw new Error("Invalid code");

    const { data: shortTokenData, error: shortTokenError } =
      await getShortLivedToken(code);
    if (shortTokenError !== null) throw new Error(shortTokenError);

    const { data, error: igUserIdError } = await getInstagramUserId(
      shortTokenData.access_token,
    );
    if (igUserIdError !== null) throw new Error(igUserIdError);
    const userInstagramId = data.id;

    const { data: longTokenData, error: longTokenError } =
      await getLongLivedToken(shortTokenData.access_token);
    if (longTokenError !== null) throw new Error(longTokenError);

    const existing = await prisma.instagramAccount.findUnique({
      where: { userId: state },
    });

    if (existing) {
      await prisma.instagramAccount.update({
        where: {
          userId: state,
        },
        data: {
          accessToken: longTokenData.access_token,
          instagramUserId: userInstagramId,
          tokenType: longTokenData.token_type,
          tokenExpiresAt: new Date(
            Date.now() + longTokenData.expires_in * 1000,
          ),
          permissions: shortTokenData.permissions,
        },
      });
    } else {
      await prisma.instagramAccount.create({
        data: {
          accessToken: longTokenData.access_token,
          instagramUserId: userInstagramId,
          tokenType: longTokenData.token_type,
          tokenExpiresAt: new Date(
            Date.now() + longTokenData.expires_in * 1000,
          ),
          permissions: shortTokenData.permissions,
          userId: state,
        },
      });
    }

    return NextResponse.redirect(new URL("/profile", ORIGIN));
  } catch (err) {
    const error = err as Error;
    console.error("Error during instagram OAuth: ", error.message);

    return NextResponse.redirect(new URL("/instagram-auth-error", ORIGIN));
  }
}
