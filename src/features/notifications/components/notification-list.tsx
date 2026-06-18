"use client";

import { Bell, CheckCircle2, Clock } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { NotificationFilters, NotificationItem, NotificationSeverity } from "@/features/notifications";

const severityVariant = {
  low: "success",
  medium: "info",
  high: "warning",
  critical: "destructive"
} as const satisfies Record<NotificationSeverity, "success" | "info" | "warning" | "destructive">;

export function NotificationList({
  filters,
  notifications
}: Readonly<{ filters: NotificationFilters; notifications: NotificationItem[] }>) {
  const [items, setItems] = useState(notifications);
  const visibleItems = useMemo(
    () =>
      items.filter((notification) => {
        if (filters.read === "read" && !notification.read) {
          return false;
        }

        if (filters.read === "unread" && notification.read) {
          return false;
        }

        return true;
      }),
    [filters.read, items]
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
      <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed bg-surface p-8 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-background">
          <Bell aria-hidden="true" className="size-6 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">No notifications found</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Try a different filter, or check back after your next digital health review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button onClick={markAllRead} size="sm" type="button" variant="outline">
          Mark all read
        </Button>
      </div>
      {visibleItems.map((notification) => (
        <Card key={notification.id} variant={notification.read ? "default" : "elevated"}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  {notification.read ? (
                    <CheckCircle2 aria-hidden="true" className="size-5" />
                  ) : (
                    <Bell aria-hidden="true" className="size-5" />
                  )}
                </div>
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
