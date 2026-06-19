"use client";

import { Bell, CheckCircle2, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { NotificationFilters, NotificationItem, NotificationSeverity } from "@/features/notifications";

const severityVariant = {
  low: "subtle",
  medium: "outline",
  high: "destructive",
  critical: "destructive"
} as const satisfies Record<NotificationSeverity, "subtle" | "outline" | "destructive">;

export function NotificationList({
  filters,
  notifications
}: Readonly<{ filters: NotificationFilters; notifications: NotificationItem[] }>) {
  const [items, setItems] = useState(notifications);

  useEffect(() => {
    setItems(notifications);
  }, [notifications]);

  const visibleItems = useMemo(
    () =>
      items.filter((notification) => {
        if (filters.severity !== "all" && notification.severity !== filters.severity) {
          return false;
        }

        if (filters.read === "read" && !notification.read) {
          return false;
        }

        if (filters.read === "unread" && notification.read) {
          return false;
        }

        return true;
      }),
    [filters.read, filters.severity, items]
  );

  function toggleRead(id: string) {
    setItems((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, read: !notification.read } : notification
      )
    );
  }

  function markAllRead() {
    setItems((current) => current.map((notification) => ({ ...notification, read: true })));
  }

  if (visibleItems.length === 0) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center border border-dashed py-12 text-center">
        <Bell aria-hidden="true" className="size-6 text-muted-foreground" />
        <h2 className="mt-4 text-heading-md">No notifications found</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Try a different filter, or check back after your next digital health review.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={markAllRead} size="sm" type="button" variant="outline">
          Mark all read
        </Button>
      </div>
      <ul className="divide-y border-y">
        {visibleItems.map((notification) => (
          <li key={notification.id} className="py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                {notification.read ? (
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                ) : (
                  <Bell aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium">{notification.title}</h2>
                    {!notification.read ? <span className="size-2 rounded-full bg-primary" aria-label="Unread" /> : null}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{notification.description}</p>
                  <p className="mt-3 inline-flex items-center gap-2 text-caption text-muted-foreground">
                    <Clock aria-hidden="true" className="size-3.5" />
                    {formatTimestamp(notification.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                <Badge variant={severityVariant[notification.severity]}>{notification.severity}</Badge>
                <Badge variant={notification.read ? "subtle" : "outline"}>{notification.read ? "read" : "unread"}</Badge>
                <Button onClick={() => toggleRead(notification.id)} size="sm" type="button" variant="outline">
                  Mark {notification.read ? "unread" : "read"}
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
