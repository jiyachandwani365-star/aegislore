import { notificationSeed } from "@/features/notifications/data";
import type { NotificationFilters, NotificationItem, NotificationService } from "@/features/notifications/types";

class InMemoryNotificationService implements NotificationService {
  async listNotifications(_userId: string, filters: NotificationFilters): Promise<NotificationItem[]> {
    return notificationSeed
      .filter((notification) => {
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
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

let notificationService: NotificationService = new InMemoryNotificationService();

export function getNotificationService() {
  return notificationService;
}

export function setNotificationService(service: NotificationService) {
  notificationService = service;
}
