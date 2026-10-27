import { apiClient } from "./client";
import { Notification } from "@/types/notification";

export async function getNotifications(unreadOnly?: boolean): Promise<Notification[]> {
  const query = unreadOnly ? "?unread=true" : "";
  const notifs = await apiClient<Notification[]>(`/notifications${query}`);
  const mapped = notifs.map((n) => ({
    ...n,
    read: n.isRead ?? n.read ?? false,
    isRead: n.isRead ?? n.read ?? false,
  }));
  return unreadOnly ? mapped.filter((n) => !n.isRead) : mapped;
}

export async function markNotificationRead(id: string): Promise<Notification> {
  const n = await apiClient<Notification>(`/notifications/${id}/read`, {
    method: "PATCH",
  });
  return {
    ...n,
    read: true,
    isRead: true,
  };
}

export async function markAllNotificationsRead(): Promise<{
  message: string;
  count: number;
  updatedCount: number;
}> {
  const res = await apiClient<{ message: string; count?: number; updatedCount?: number }>(
    "/notifications/read-all",
    {
      method: "PATCH",
    }
  );
  const count = res.count ?? res.updatedCount ?? 0;
  return {
    message: res.message || "All notifications marked as read",
    count,
    updatedCount: count,
  };
}

export async function deleteNotification(id: string): Promise<void> {
  return apiClient<void>(`/notifications/${id}`, {
    method: "DELETE",
  });
}
