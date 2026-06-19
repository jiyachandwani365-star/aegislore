import { Bell, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

import { AppPageHeader, AppPageShell } from "@/components/layout/app-page";
import { Button } from "@/components/ui/button";
import { AiAssistantChat } from "@/features/ai-assistant/components/ai-assistant-chat";
import { ScoreSummary } from "@/features/digital-health/components/score-breakdown";
import { calculateDigitalHealthScore } from "@/features/digital-health/scoring";
import { requireUser } from "@/server/auth/session";

export const metadata = {
  title: "Dashboard"
};

export default async function DashboardPage() {
  const user = await requireUser();
  const displayName = user.name ?? user.email ?? "there";
  const scoreResult = calculateDigitalHealthScore({
    passwordReuse: true,
    knownBreachExposure: false,
    mfaEnabled: true,
    passwordStrength: 75,
    emailExposure: true,
    deviceSecurity: "unknown"
  });

  return (
    <AppPageShell>
      <AppPageHeader
        action={
          <Button asChild className="w-full sm:w-auto">
            <Link href={"/health-check" as Route}>
              Start health check
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        }
        description="Your score and the next step worth taking."
        eyebrow="Digital health"
        title={`Welcome back, ${displayName}`}
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_minmax(16rem,22rem)]">
        <ScoreSummary result={scoreResult} />
        <div>
          <h2 className="font-medium">What needs attention</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            <Bell aria-hidden="true" className="mr-1.5 inline size-4 align-text-bottom" />
            No recent alerts.{" "}
            <Link className="font-medium text-primary underline-offset-4 hover:underline" href="/notifications">
              View notification history
            </Link>
          </p>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-medium">Security Coach</h2>
        <p className="mt-1 text-sm text-muted-foreground">Ask questions about your security posture.</p>
        <div className="mt-4">
          <AiAssistantChat />
        </div>
      </section>
    </AppPageShell>
  );
}
