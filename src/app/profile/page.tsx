import { Mail, UserRound } from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/server/auth/session";

export const metadata = {
  title: "Profile"
};

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container max-w-3xl py-8">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">Account</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Profile</h1>
        </div>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Your identity</CardTitle>
            <CardDescription>Profile information provided by your authentication method.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-4 rounded-lg border bg-background p-4">
              <UserRound aria-hidden="true" className="size-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user.name ?? "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border bg-background p-4">
              <Mail aria-hidden="true" className="size-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email ?? "Not provided"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
