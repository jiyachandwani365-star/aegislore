import { CalendarCheck, CheckCircle2, ShieldCheck, TrendingUp, type LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { JourneyEvent, SecurityJourneySnapshot } from "@/features/security-journey/types";

const eventLabels: Record<JourneyEvent["type"], string> = {
  score: "Score",
  issue_fixed: "Issue fixed",
  milestone: "Milestone",
  account_improvement: "Account improvement"
};

const eventIcons = {
  score: TrendingUp,
  issue_fixed: CheckCircle2,
  milestone: ShieldCheck,
  account_improvement: CalendarCheck
} satisfies Record<JourneyEvent["type"], LucideIcon>;

export function SecurityTimeline({
  journey
}: Readonly<{
  journey: Pick<SecurityJourneySnapshot, "issuesFixed" | "securityMilestones" | "accountImprovements">;
}>) {
  const events = [...journey.issuesFixed, ...journey.securityMilestones, ...journey.accountImprovements].sort(
    (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Timeline</CardTitle>
        <CardDescription>Recent fixes, milestones, and account improvements.</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event, index) => {
              const Icon = eventIcons[event.type];

              return (
                <div key={event.id} className="relative flex gap-4">
                  {index < events.length - 1 ? (
                    <div className="absolute left-4 top-9 h-[calc(100%-1rem)] w-px bg-border" aria-hidden="true" />
                  ) : null}
                  <div className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon aria-hidden="true" className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1 rounded-lg border bg-background p-4">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{event.description}</p>
                      </div>
                      <Badge variant="subtle">{eventLabels[event.type]}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-caption text-muted-foreground">
                      <span>{event.date}</span>
                      {typeof event.scoreAfter === "number" ? <span>Score after: {event.scoreAfter}</span> : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed bg-background p-6 text-center">
            <p className="font-medium">No progress events yet</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Completed fixes and account improvements will be added here after real actions are recorded.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
