import { Bell } from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationFilterTabs } from "@/features/notifications/components/notification-filter-tabs";
import { NotificationList } from "@/features/notifications/components/notification-list";
import { getNotificationService, parseNotificationFilters } from "@/features/notifications";
import { requireUser } from "@/server/auth/session";

export const metadata = {
  title: "Notifications"
};

export default async function NotificationsPage({
  searchParams
}: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  const user = await requireUser();
  const params = await searchParams;
  const filters = parseNotificationFilters(params);
  const notifications = await getNotificationService().listNotifications(user.id, filters);
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8">
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <Badge variant="info" className="mb-4">
              <Bell aria-hidden="true" />
              Alert history
            </Badge>
            <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">Notifications</h1>
            <p className="mt-3 max-w-2xl text-body text-muted-foreground">
              A clear history of alerts, updates, and recommended reviews.
            </p>
          </div>
          <Card className="w-full lg:w-72" variant="elevated">
            <CardHeader className="pb-3">
              <CardDescription>Unread</CardDescription>
              <CardTitle>{unreadCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <section className="grid gap-5 lg:grid-cols-[18rem_1fr]">
          <NotificationFilterTabs filters={filters} />
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Alert history</CardTitle>
              <CardDescription>Filter by severity or read status.</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationList filters={filters} notifications={notifications} />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
