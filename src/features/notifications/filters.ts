import type {
  NotificationFilters,
  NotificationReadFilter,
  NotificationSeverityFilter
} from "@/features/notifications/types";

const severityFilters = new Set<NotificationSeverityFilter>(["all", "low", "medium", "high", "critical"]);
const readFilters = new Set<NotificationReadFilter>(["all", "read", "unread"]);

export function parseNotificationFilters(searchParams: Record<string, string | string[] | undefined>): NotificationFilters {
  const severityParam = valueFromParam(searchParams.severity);
  const readParam = valueFromParam(searchParams.read);

  return {
    severity: severityFilters.has(severityParam as NotificationSeverityFilter)
      ? (severityParam as NotificationSeverityFilter)
      : "all",
    read: readFilters.has(readParam as NotificationReadFilter) ? (readParam as NotificationReadFilter) : "all"
  };
}

function valueFromParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
