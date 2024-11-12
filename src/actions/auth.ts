"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  if (!name || !password) {
    return { error: "Требуются имя и пароль" };
  }

  const exists = await prisma.user.findFirst({ where: { name } });
  if (exists) {
    return { error: "Пользователь уже существует" };
  }

  const user = await prisma.user.create({
    data: { name, password },
  });
  const cookiesInstance = await cookies();
  cookiesInstance.set("userId", user.id);
  redirect("/profile");
}

export async function login(formData: FormData) {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findFirst({ where: { name } });
  if (!user) {
    return { error: "Пользователь не найден" };
  }

  if (user.password !== password) {
    return { error: "Неверный пароль" };
  }

  const cookiesInstance = await cookies();
  cookiesInstance.set("userId", user.id);
  redirect("/profile");
}

export async function logout() {
  const cookiesInstance = await cookies();
  cookiesInstance.delete("userId");
  redirect("/login");
}
