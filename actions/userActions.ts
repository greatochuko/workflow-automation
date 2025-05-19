"use server";

import { hashPassword } from "@/lib/auth/hashPassword";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createUser(userData: {
  fullName: string;
  role: User["role"];
  profilePicture: string;
  email: string;
  password: string;
  companyName: string;
  specialties: string[];
}) {
  try {
    const hashedPassword = await hashPassword(userData.password);

    const newUser = await prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });

    revalidatePath("/users");

    return { data: newUser, error: null };
  } catch {
    return { data: null, error: "Server Error" };
  }
}
