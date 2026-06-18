import type { SecurityJourneySnapshot } from "@/features/security-journey/types";

export function getSecurityJourneySnapshot(currentScore: number): SecurityJourneySnapshot {
  const today = new Date().toISOString().slice(0, 10);

  return {
    scoreHistory: [{ date: today, score: currentScore }],
    issuesFixed: [],
    securityMilestones: [],
    accountImprovements: [],
    weeklyReport: {
      period: "Current week",
      title: "Weekly security report",
      summary: "AegisLore has your current score baseline. Progress will update after completed fixes are recorded.",
      highlights: [`Current score: ${currentScore}`, "No completed fixes recorded this week"]
    },
    monthlyProgressReport: {
      period: "Current month",
      title: "Monthly progress report",
      summary: "Monthly progress will compare future checks against this baseline.",
      highlights: [`Baseline score: ${currentScore}`, "No milestones recorded yet"]
    },
    streak: {
      currentDays: 0,
      bestDays: 0,
      lastActivityDate: today
    },
    achievements: []
  };
}
