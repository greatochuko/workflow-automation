"use server";

import { comparePassword } from "@/lib/auth/hashPassword";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { signToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

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

    const token = await signToken({ id: user.id, role: user.role });

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
