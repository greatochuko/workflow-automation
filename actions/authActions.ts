"use server";

import { comparePassword, hashPassword } from "@/lib/auth/hashPassword";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { signToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { getTokenFromCookie } from "@/lib/utils/tokenHelper";

export async function loginUser(email: string, password: string) {
  let canRedirect = false;
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) return { error: "Invalid username and password combination" };

    const passwordIsCorrect = await comparePassword(password, user.password);
    if (!passwordIsCorrect) {
      return { error: "Invalid username and password combination" };
    }

    const cookieStore = await cookies();

    const token = await signToken({
      id: user.id,
      role: user.role,
      passwordChanged: user.passwordChanged,
    });

    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    canRedirect = true;
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  } finally {
    if (canRedirect) redirect("/");
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  redirect("/login");
}

export async function setNewPassword(newPassword: string) {
  let canRedirect;
  try {
    const { payload } = await getTokenFromCookie();

    if (!payload?.user.id) {
      return { data: null, error: "Invalid token" };
    }

    const newHashedPassword = await hashPassword(newPassword);

    if (!newHashedPassword) {
      return { data: null, error: "Failed to hash new password" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.user.id },
      data: {
        password: newHashedPassword,
        passwordChanged: true,
      },
    });

    const cookieStore = await cookies();

    const token = await signToken({
      id: updatedUser.id,
      role: updatedUser.role,
      passwordChanged: true,
    });

    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    canRedirect = true;
  } catch {
    return { data: null, error: "Server Error" };
  } finally {
    if (canRedirect) redirect("/");
  }
}

export async function generateInstagramOauthLink(userId: string) {
  const authUrl = new URL("https://www.facebook.com/dialog/oauth");
  authUrl.searchParams.set("client_id", process.env.FACEBOOK_APP_ID!);
  authUrl.searchParams.set("display", "page");
  authUrl.searchParams.set(
    "extras",
    `{"setup":{"channel":"IG_API_ONBOARDING"}}.`,
  );
  authUrl.searchParams.set("redirect_uri", process.env.FACEBOOK_REDIRECT_URI!);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set(
    "scope",
    "pages_show_list,instagram_basic,pages_read_engagement,pages_read_user_content,instagram_content_publish,business_management",
  );
  authUrl.searchParams.set("state", userId);

  return authUrl.toString();
}
