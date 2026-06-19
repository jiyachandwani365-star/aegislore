import { redirect } from "next/navigation";

import { AuthPageShell } from "@/components/layout/auth-page-shell";
import { AuthCard } from "@/features/auth/components/auth-card";
import { authProviderStatus } from "@/features/auth/config";
import { auth } from "@/server/auth";

export const metadata = {
  title: "Sign in"
};

export default async function SignInPage({
  searchParams
}: Readonly<{ searchParams: Promise<{ error?: string }> }>) {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <AuthPageShell>
      <AuthCard
        error={params.error}
        hasEmailProvider={authProviderStatus.email}
        hasGoogleProvider={authProviderStatus.google}
        mode="sign-in"
      />
    </AuthPageShell>
  );
}
