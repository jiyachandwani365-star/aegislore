"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { deleteUserAccount } from "@/features/account/repository";
import { auth, signOut } from "@/server/auth";

const deleteAccountSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  confirmation: z.literal("DELETE")
});

export type DeleteAccountState = {
  error?: string;
};

export async function deleteAccount(
  _previousState: DeleteAccountState,
  formData: FormData
): Promise<DeleteAccountState> {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    return { error: "You must be signed in to delete your account." };
  }

  const parsed = deleteAccountSchema.safeParse({
    email: formData.get("email"),
    confirmation: formData.get("confirmation")
  });

  if (!parsed.success) {
    return { error: "Enter your email and type DELETE to confirm." };
  }

  if (parsed.data.email !== session.user.email.toLowerCase()) {
    return { error: "Email does not match your account." };
  }

  try {
    await deleteUserAccount(session.user.id);
    await signOut({ redirect: false });
  } catch {
    return { error: "Unable to delete your account. Please try again." };
  }

  redirect("/");
}
