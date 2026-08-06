import { get, patch, del } from "./client.js";

export function getNotifications(size = 20) {
  return get(`notifications?size=${size}`);
}

export function markNotificationRead(notificationId) {
  return patch(`notifications/${notificationId}`, undefined);
}

export function markAllNotificationsRead() {
  return patch("notifications", undefined);
}

export function deleteNotification(notificationId) {
  return del(`notifications/${notificationId}`);
}

export function deleteAllNotifications() {
  return del("notifications");
}
