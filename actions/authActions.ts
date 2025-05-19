"use server";

import { comparePassword } from "@/lib/auth/hashPassword";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function loginUser(email: string, password: string) {
  let canRedirect = false;
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) return { error: "Invalid username and password combination" };
    console.log(user);

    const passwordIsCorrect = await comparePassword(password, user.password);
    if (!passwordIsCorrect) {
      return { error: "Invalid username and password combination" };
    }

    canRedirect = true;
  } catch (err) {
    const error = err as Error;
    return { error: error.message };
  } finally {
    if (canRedirect) redirect("/");
  }
}
