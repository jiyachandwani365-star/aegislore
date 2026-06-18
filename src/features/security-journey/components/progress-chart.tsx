import { BarChart3, CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ScoreHistoryPoint, SecurityReport } from "@/features/security-journey/types";

export function ProgressChart({
  scoreHistory,
  weeklyReport,
  monthlyProgressReport
}: Readonly<{
  scoreHistory: ScoreHistoryPoint[];
  weeklyReport: SecurityReport;
  monthlyProgressReport: SecurityReport;
}>) {
  const firstScore = scoreHistory.at(0)?.score ?? 0;
  const latestScore = scoreHistory.at(-1)?.score ?? 0;
  const scoreChange = latestScore - firstScore;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 aria-hidden="true" className="size-5 text-primary" />
              Progress Chart
            </CardTitle>
            <CardDescription>Score history and report summaries.</CardDescription>
          </div>
          <Badge variant={scoreChange >= 0 ? "success" : "warning"}>
            {scoreChange >= 0 ? "+" : ""}
            {scoreChange} points
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg border bg-background p-4">
          <div className="flex h-44 items-end gap-3" role="img" aria-label={`Score moved from ${firstScore} to ${latestScore}.`}>
            {scoreHistory.map((point) => (
              <div key={point.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full items-end rounded-md bg-muted">
                  <div
                    className="w-full rounded-md bg-primary"
                    style={{ height: `${point.score}%` }}
                    aria-hidden="true"
                  />
                </div>
                <div className="text-center">
                  <p className="text-caption font-medium">{point.score}</p>
                  <p className="truncate text-caption text-muted-foreground">{formatShortDate(point.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <ReportSummary report={weeklyReport} />
          <ReportSummary report={monthlyProgressReport} />
        </div>
      </CardContent>
    </Card>
  );
}

function ReportSummary({ report }: Readonly<{ report: SecurityReport }>) {
  return (
    <section className="rounded-lg border bg-background p-4" aria-label={report.title}>
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <CalendarDays aria-hidden="true" className="size-4" />
        </div>
        <div>
          <p className="font-medium">{report.title}</p>
          <p className="text-caption text-muted-foreground">{report.period}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{report.summary}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {report.highlights.map((highlight) => (
          <li key={highlight} className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            {highlight}
          </li>
        ))}
      </ul>
    </section>
  );
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(date));
}
