import { AppPageHeader, AppPageShell } from "@/components/layout/app-page";
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
    <AppPageShell>
      <AppPageHeader
        description={
          unreadCount > 0
            ? `${unreadCount} unread alert${unreadCount === 1 ? "" : "s"} in your history.`
            : "A clear history of alerts, updates, and recommended reviews."
        }
        eyebrow="Alerts"
        title="Notifications"
      />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,16rem)_1fr]">
        <NotificationFilterTabs filters={filters} />
        <div>
          <h2 className="sr-only">Alert history</h2>
          <NotificationList filters={filters} notifications={notifications} />
        </div>
      </section>
    </AppPageShell>
  );
}
