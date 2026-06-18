import { ShieldAlert } from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { Badge } from "@/components/ui/badge";
import { ScamCheckClient } from "@/features/scam-check/components/scam-check-client";
import { getRecentScamScans } from "@/features/scam-check/repository";
import { requireUser } from "@/server/auth/session";

export const metadata = {
  title: "Scam Check"
};

export default async function ScamCheckPage() {
  const user = await requireUser();
  const scans = await getRecentScamScans(user.id);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8">
        <div className="mb-8">
          <Badge variant="info" className="mb-4">
            <ShieldAlert aria-hidden="true" />
            Scam Check
          </Badge>
          <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">Check before you trust it</h1>
          <p className="mt-3 max-w-2xl text-body text-muted-foreground">
            Paste a suspicious email, text, link, social message, or image text. AegisLore will give you a clear risk
            level and the safest next step.
          </p>
        </div>
        <ScamCheckClient initialScans={scans} />
      </main>
    </div>
  );
}
