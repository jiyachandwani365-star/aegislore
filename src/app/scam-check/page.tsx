import { AppPageHeader, AppPageShell } from "@/components/layout/app-page";
import { ScamCheckClient } from "@/features/scam-check/components/scam-check-client";
import { getRecentScamScans } from "@/features/scam-check/repository";
import { requireUser } from "@/server/auth/session";

export const metadata = {
  title: "Scam Check"
};

export default async function ScamCheckPage() {
  const user = await requireUser();
  let scans: Awaited<ReturnType<typeof getRecentScamScans>> = [];
  let loadError: string | null = null;

  try {
    scans = await getRecentScamScans(user.id);
  } catch {
    loadError = "Unable to load scan history. You can still run new checks.";
  }

  return (
    <AppPageShell>
      <AppPageHeader
        description="Paste a suspicious email, text, link, social message, or image text. AegisLore will give you a clear risk level and the safest next step."
        eyebrow="Scam check"
        title="Check before you trust it"
      />
      <ScamCheckClient initialLoadError={loadError} initialScans={scans} />
    </AppPageShell>
  );
}
