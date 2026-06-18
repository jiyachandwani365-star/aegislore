import type { NotificationItem } from "@/features/notifications/types";

export const notificationSeed: NotificationItem[] = [
  {
    id: "recovery-options",
    title: "Recovery options need review",
    description: "Add or confirm backup access for important accounts.",
    severity: "high",
    read: false,
    createdAt: "2026-06-17T09:20:00.000Z"
  },
  {
    id: "score-improved",
    title: "Digital health score improved",
    description: "Your score increased after recent account updates.",
    severity: "low",
    read: false,
    createdAt: "2026-06-16T15:45:00.000Z"
  },
  {
    id: "password-review",
    title: "Password review suggested",
    description: "A few important accounts may benefit from stronger passwords.",
    severity: "medium",
    read: true,
    createdAt: "2026-06-15T12:10:00.000Z"
  },
  {
    id: "quiet-period",
    title: "No urgent alerts",
    description: "No immediate action was needed during the latest check.",
    severity: "low",
    read: true,
    createdAt: "2026-06-14T08:30:00.000Z"
  }
];
