import { AppPageHeader, AppPageShell } from "@/components/layout/app-page";
import { HealthCheckForm } from "@/features/digital-health/components/health-check-form";
import { requireUser } from "@/server/auth/session";

export const metadata = {
  title: "Health check"
};

export default async function HealthCheckPage({
  searchParams
}: Readonly<{ searchParams: Promise<{ focus?: string }> }>) {
  await requireUser();
  const params = await searchParams;

  return (
    <AppPageShell>
      <AppPageHeader
        description="Plain questions that update your score as you answer."
        eyebrow="Digital health"
        title="Start health check"
      />
      <HealthCheckForm focus={params.focus} />
    </AppPageShell>
  );
}
