import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const ORIGIN = process.env.ORIGIN!;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID!;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET!;
const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI!;
const FACEBOOK_GRAPH_BASE_URL = "https://graph.facebook.com/v19.0/";

async function getShortLivedToken(code: string): Promise<
  | {
      data: { access_token: string; token_type: string; expires_in: number };
      error: null;
    }
  | { data: null; error: string }
> {
  try {
    const res = await fetch(
      `${FACEBOOK_GRAPH_BASE_URL}oauth/access_token` +
        `?client_id=${FACEBOOK_APP_ID}` +
        `&redirect_uri=${encodeURIComponent(FACEBOOK_REDIRECT_URI)}` +
        `&client_secret=${FACEBOOK_APP_SECRET}` +
        `&code=${code}`,
    );

    const shortTokenData = await res.json();

    if (!res.ok) throw new Error(shortTokenData.error.message);

    return { data: shortTokenData, error: null };
  } catch (err) {
    const error = err as Error;
    return { data: null, error: error.message };
  }
}

async function getLongLivedToken(short_access_token: string): Promise<
  | {
      data: { access_token: string; token_type: string; expires_in: number };
      error: null;
    }
  | { data: null; error: string }
> {
  try {
    const res = await fetch(
      `${FACEBOOK_GRAPH_BASE_URL}oauth/access_token` +
        `?grant_type=fb_exchange_token` +
        `&client_id=${FACEBOOK_APP_ID}` +
        `&client_secret=${FACEBOOK_APP_SECRET}` +
        `&fb_exchange_token=${short_access_token}`,
    );

    const longTokenData = await res.json();

    if (!res.ok) throw new Error(longTokenData.error.message);

    return { data: longTokenData, error: null };
  } catch (err) {
    const error = err as Error;
    return { data: null, error: error.message };
  }
}

async function getInstagramUserId(long_access_token: string): Promise<
  | {
      data: string;
      error: null;
    }
  | { data: null; error: string }
> {
  try {
    const pagesRes = await fetch(
      `${FACEBOOK_GRAPH_BASE_URL}me/accounts?access_token=${long_access_token}`,
    );
    const pagesJson = await pagesRes.json();
    if (!pagesRes.ok || !pagesJson.data?.length) {
      throw new Error("Failed to fetch Facebook Pages or none found.");
    }
    const page = pagesJson.data[0];

    const igRes = await fetch(
      `${FACEBOOK_GRAPH_BASE_URL}${page.id}?fields=instagram_business_account&access_token=${long_access_token}`,
    );
    const igJson = await igRes.json();
    if (!igRes.ok || !igJson.instagram_business_account?.id) {
      throw new Error("Failed to fetch Instagram Business Account ID.");
    }
    const igUserId = igJson.instagram_business_account.id;

    return { data: igUserId, error: null };
  } catch (err) {
    const error = err as Error;
    return { data: null, error: error.message };
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
      throw new Error(
        "Missing 'code' parameter in Facebook OAuth callback URL.",
      );
    }

    if (!state) {
      throw new Error(
        "Missing 'state' parameter in Facebook OAuth callback URL.",
      );
    }

    const { data: shortTokenData, error: shortTokenError } =
      await getShortLivedToken(code);
    if (shortTokenError !== null) {
      throw new Error(shortTokenError);
    }

    const { data: longTokenData, error: longTokenError } =
      await getLongLivedToken(shortTokenData.access_token);
    if (longTokenError !== null) {
      throw new Error(longTokenError);
    }

    const { data: instagramUserId, error: instagramIdError } =
      await getInstagramUserId(longTokenData.access_token);
    if (instagramIdError !== null) {
      throw new Error(instagramIdError);
    }

    await prisma.user.update({
      where: { id: state },
      data: {
        facebookAuth: {
          access_token: longTokenData.access_token,
          expires_in: longTokenData.expires_in,
          token_type: longTokenData.token_type,
          updated_at: new Date(),
          instagram_user_id: instagramUserId,
        },
      },
    });

    return NextResponse.redirect(new URL("/profile", ORIGIN));
  } catch (err) {
    const error = err as Error;
    console.error("Error during facebook OAuth: ", error.message);

    return NextResponse.redirect(new URL("/facebook-auth-error", ORIGIN));
  }
}
