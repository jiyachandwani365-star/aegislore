import { Award, Flame, LockKeyholeOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AchievementBadge, SecurityStreak } from "@/features/security-journey/types";

export function AchievementSystem({
  achievements,
  streak
}: Readonly<{
  achievements: AchievementBadge[];
  streak: SecurityStreak;
}>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>Milestone badges and steady progress tracking.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <Flame aria-hidden="true" className="size-5" />
            </div>
            <div>
              <p className="font-medium">{streak.currentDays}-day streak</p>
              <p className="text-sm text-muted-foreground">
                Best streak: {streak.bestDays} days. Last activity: {streak.lastActivityDate}.
              </p>
            </div>
          </div>
        </div>

        {achievements.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed bg-background p-6 text-center">
            <p className="font-medium">No badges earned yet</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Badges appear after completed fixes and real account improvements are recorded.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AchievementCard({ achievement }: Readonly<{ achievement: AchievementBadge }>) {
  const isEarned = Boolean(achievement.earnedAt);
  const progressPercent = Math.min(Math.round((achievement.progress / achievement.target) * 100), 100);
  const Icon = isEarned ? Award : LockKeyholeOpen;

  return (
    <section className="rounded-lg border bg-background p-4" aria-label={achievement.title}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon aria-hidden="true" className="size-5" />
        </div>
        <Badge variant={isEarned ? "success" : "subtle"}>{isEarned ? "Earned" : "In progress"}</Badge>
      </div>
      <h3 className="mt-4 font-medium">{achievement.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{achievement.description}</p>
      <div className="mt-4">
        <div className="flex justify-between text-caption text-muted-foreground">
          <span>
            {achievement.progress}/{achievement.target}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-muted">
          <div className="h-2 rounded-full bg-primary" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
      {achievement.earnedAt ? <p className="mt-3 text-caption text-muted-foreground">Earned {achievement.earnedAt}</p> : null}
    </section>
  );
}
