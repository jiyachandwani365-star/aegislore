export type NotificationSeverity = "low" | "medium" | "high" | "critical";
export type NotificationReadState = "read" | "unread";
export type NotificationSeverityFilter = NotificationSeverity | "all";
export type NotificationReadFilter = NotificationReadState | "all";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  severity: NotificationSeverity;
  read: boolean;
  createdAt: string;
}

export interface NotificationFilters {
  severity: NotificationSeverityFilter;
  read: NotificationReadFilter;
}

export interface NotificationService {
  listNotifications(userId: string, filters: NotificationFilters): Promise<NotificationItem[]>;
}
