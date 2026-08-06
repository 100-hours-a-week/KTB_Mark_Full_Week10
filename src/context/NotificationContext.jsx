import { createContext, useCallback, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { useNotificationStream } from "../hooks/useNotificationStream.js";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification as deleteNotificationRequest,
  deleteAllNotifications as deleteAllNotificationsRequest,
} from "../api/notifications.js";

export const NotificationContext = createContext(null);

const TOAST_DURATION = 4000;

export function NotificationProvider({ children }) {
  const { userId } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((toastId) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  }, []);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    getNotifications().then((result) => {
      setNotifications(result.data.notifications);
      setUnreadCount(result.data.unreadCount);
    });
  }, [userId]);

  const handleNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    const toastId = `${notification.notificationId}-${Date.now()}`;
    setToasts((prev) => [...prev, { id: toastId, notification }]);
    setTimeout(() => dismissToast(toastId), TOAST_DURATION);
  }, [dismissToast]);

  useNotificationStream(userId, handleNotification);

  const markAsRead = useCallback(
    (notificationId) => {
      const target = notifications.find((n) => n.notificationId === notificationId);
      if (target && !target.read) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      setNotifications((prev) =>
        prev.map((n) => (n.notificationId === notificationId ? { ...n, read: true } : n)),
      );
      markNotificationRead(notificationId).catch(() => {});
    },
    [notifications],
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    markAllNotificationsRead().catch(() => {});
  }, []);

  const deleteNotification = useCallback(
    (notificationId) => {
      const target = notifications.find((n) => n.notificationId === notificationId);
      if (target && !target.read) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      setNotifications((prev) => prev.filter((n) => n.notificationId !== notificationId));
      deleteNotificationRequest(notificationId).catch(() => {});
    },
    [notifications],
  );

  const deleteAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    deleteAllNotificationsRequest().catch(() => {});
  }, []);

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    toasts,
    dismissToast,
  };
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
