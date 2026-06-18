import { redirect } from "next/navigation";

import { AuthCard } from "@/features/auth/components/auth-card";
import { authProviderStatus } from "@/features/auth/config";
import { auth } from "@/server/auth";

export const metadata = {
  title: "Create account"
};

export default async function SignupPage({
  searchParams
}: Readonly<{ searchParams: Promise<{ error?: string }> }>) {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <AuthCard
        mode="sign-up"
        hasGoogleProvider={authProviderStatus.google}
        hasEmailProvider={authProviderStatus.email}
        error={params.error}
      />
    </main>
  );
}
