"use server";

import { hashPassword } from "@/lib/auth/hashPassword";
import { prisma } from "@/lib/prisma";
import { type UserType } from "@/types/user";
import { revalidatePath } from "next/cache";

export async function createUser(userData: {
  fullName: string;
  role: UserType["role"];
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

export async function assignFreelancerToClient(
  clientId: string,
  freelancer: UserType | null,
) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: clientId },
      data: {
        assignedFreelancers: {
          set: [],
          connect: freelancer ? { id: freelancer.id } : undefined,
        },
      },
    });

    revalidatePath("/users");

    return { data: updatedUser, error: null };
  } catch {
    return { data: null, error: "Server Error" };
  }
}
