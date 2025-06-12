import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json(
      { error: "Missing code or state" },
      { status: 400 },
    );
  }

  try {
    // STEP 1: Exchange code for short-lived token
    const shortTokenRes = await fetch(
      "https://api.instagram.com/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.INSTAGRAM_CLIENT_ID!,
          client_secret: process.env.INSTAGRAM_CLIENT_SECRET!,
          grant_type: "authorization_code",
          redirect_uri: process.env.INSTAGRAM_REDIRECT_URI!,
          code,
        }),
      },
    );

    const shortTokenData = await shortTokenRes.json();

    if (!shortTokenRes.ok || !shortTokenData.access_token) {
      return NextResponse.json(
        {
          error:
            shortTokenData.error_message || "Failed to get short-lived token",
        },
        { status: 500 },
      );
    }

    const shortLivedToken = shortTokenData.access_token;

    // STEP 2: Exchange short-lived token for long-lived token
    const longTokenRes = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${shortLivedToken}`,
    );
    const longTokenData = await longTokenRes.json();

    if (!longTokenRes.ok || !longTokenData.access_token) {
      return NextResponse.json(
        {
          error:
            longTokenData.error?.message || "Failed to get long-lived token",
        },
        { status: 500 },
      );
    }

    await prisma.user.update({
      where: { id: state },
      data: {
        instagramAuth: {
          access_token: longTokenData.access_token,
          expires_in: longTokenData.expires_in,
          user_id: shortTokenData.user_id,
          updated_at: new Date(),
        },
      },
    });

    return NextResponse.redirect(new URL("/profile", process.env.ORIGIN));
  } catch (err) {
    const error = err as Error;
    console.error("Error during instagram OAuth: ", error.message);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
