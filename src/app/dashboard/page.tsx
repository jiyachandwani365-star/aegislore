import {
  AlertCircle,
  ArrowRight,
  Bell,
  CalendarClock,
  Lightbulb,
  LockKeyhole,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

import { AppHeader } from "@/components/layout/app-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AiAssistantChat } from "@/features/ai-assistant/components/ai-assistant-chat";
import { ScoreBreakdown } from "@/features/digital-health/components/score-breakdown";
import { calculateDigitalHealthScore } from "@/features/digital-health/scoring";
import {
  AchievementSystem,
  getSecurityJourneySnapshot,
  ProgressChart,
  SecurityTimeline
} from "@/features/security-journey";
import { requireUser } from "@/server/auth/session";

export const metadata = {
  title: "Dashboard"
};

const issues = [
  {
    title: "Review reused passwords",
    description: "Some accounts may be safer with unique passwords.",
    priority: "High",
    icon: LockKeyhole,
    href: "/health-check?focus=passwords" as Route
  },
  {
    title: "Add recovery options",
    description: "A backup email or phone can help you regain access.",
    priority: "Medium",
    icon: ShieldCheck,
    href: "/health-check?focus=recovery" as Route
  },
  {
    title: "Check old accounts",
    description: "Close or update accounts you no longer use.",
    priority: "Low",
    icon: CalendarClock,
    href: "/health-check?focus=old-accounts" as Route
  }
];

const activity = [
  "Profile opened",
  "Session started",
  "Settings reviewed"
];

function EmptyState({
  icon: Icon,
  title,
  description
}: Readonly<{ icon: typeof Bell; title: string; description: string }>) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed bg-surface p-6 text-center">
      <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-background">
        <Icon aria-hidden="true" className="size-5 text-muted-foreground" />
      </div>
      <p className="font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

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
  const securityJourney = getSecurityJourneySnapshot();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <Badge variant="success" className="mb-4">
              <Sparkles aria-hidden="true" />
              Digital health dashboard
            </Badge>
            <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">Welcome back, {displayName}</h1>
            <p className="mt-3 max-w-2xl text-body text-muted-foreground">
              A calm view of your account safety, recovery readiness, and recent activity.
            </p>
          </div>
          <Button asChild>
            <Link href={"/health-check" as Route}>
              Start health check
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <ScoreBreakdown result={scoreResult} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <AlertCircle aria-hidden="true" className="size-5 text-secondary" />
                Risk Summary
              </CardTitle>
              <CardDescription>Plain-language guidance on what deserves attention.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert variant="warning">
                <AlertTitle>Recovery options need review</AlertTitle>
                <AlertDescription>Add or confirm recovery details for important accounts.</AlertDescription>
              </Alert>
              <Alert variant="success">
                <AlertTitle>No urgent alerts</AlertTitle>
                <AlertDescription>Nothing currently needs immediate action.</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Issue Cards</CardTitle>
              <CardDescription>Recommended actions, ordered by practical impact.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3 xl:grid-cols-1">
              {issues.map((issue) => (
                <div key={issue.title} className="rounded-lg border bg-background p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <issue.icon aria-hidden="true" className="size-5" />
                    </div>
                    <Badge variant={issue.priority === "High" ? "warning" : "subtle"}>{issue.priority}</Badge>
                  </div>
                  <h3 className="font-medium">{issue.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{issue.description}</p>
                  <Button asChild className="mt-4 px-0" variant="link">
                    <Link href={issue.href}>
                      Review
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-5">
            <AiAssistantChat />
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Important changes will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={Bell}
                title="No recent alerts"
                description="You are all clear for now. We will show plain, useful alerts here when something needs attention."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Account activity from this workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activity.map((item, index) => (
                  <div key={item}>
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-secondary">
                        <Lightbulb aria-hidden="true" className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{item}</p>
                        <p className="text-caption text-muted-foreground">Just now</p>
                      </div>
                    </div>
                    {index < activity.length - 1 ? <Separator className="mt-4" /> : null}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <ProgressChart
            scoreHistory={securityJourney.scoreHistory}
            weeklyReport={securityJourney.weeklyReport}
            monthlyProgressReport={securityJourney.monthlyProgressReport}
          />
          <AchievementSystem achievements={securityJourney.achievements} streak={securityJourney.streak} />
        </section>

        <section className="mt-5">
          <SecurityTimeline journey={securityJourney} />
        </section>
      </main>
    </div>
  );
}
