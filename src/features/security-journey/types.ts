export type JourneyEventType = "score" | "issue_fixed" | "milestone" | "account_improvement";

export interface ScoreHistoryPoint {
  date: string;
  score: number;
}

export interface JourneyEvent {
  id: string;
  type: JourneyEventType;
  title: string;
  description: string;
  date: string;
  scoreAfter?: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  earnedAt?: string;
  progress: number;
  target: number;
}

export interface SecurityReport {
  period: string;
  title: string;
  summary: string;
  highlights: string[];
}

export interface SecurityStreak {
  currentDays: number;
  bestDays: number;
  lastActivityDate: string;
}

export interface SecurityJourneySnapshot {
  scoreHistory: ScoreHistoryPoint[];
  issuesFixed: JourneyEvent[];
  securityMilestones: JourneyEvent[];
  accountImprovements: JourneyEvent[];
  weeklyReport: SecurityReport;
  monthlyProgressReport: SecurityReport;
  streak: SecurityStreak;
  achievements: AchievementBadge[];
}
