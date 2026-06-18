"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { signIn, signOut } from "@/server/auth";

const emailSchema = z.object({
  email: z.string().trim().toLowerCase().email()
});

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signInWithEmail(formData: FormData) {
  const mode = formData.get("mode") === "sign-up" ? "sign-up" : "sign-in";
  const parsed = emailSchema.safeParse({
    email: formData.get("email")
  });

  if (!parsed.success) {
    redirect(`${mode === "sign-up" ? "/signup" : "/sign-in"}?error=invalid_email`);
  }

  await signIn("email", {
    email: parsed.data.email,
    redirectTo: "/dashboard"
  });
}

export async function signOutCurrentUser() {
  await signOut({ redirectTo: "/" });
  redirect("/");
}
