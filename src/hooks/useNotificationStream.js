import { useEffect, useRef } from "react";
import { BASE_URL } from "../api/client.js";

export function useNotificationStream(userId, onNotification) {
  const onNotificationRef = useRef(onNotification);
  onNotificationRef.current = onNotification;

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    const eventSource = new EventSource(`${BASE_URL}notifications/subscribe`, {
      withCredentials: true,
    });

    eventSource.addEventListener("notification", (event) => {
      const data = JSON.parse(event.data);
      onNotificationRef.current(data);
    });

    return () => {
      eventSource.close();
    };
  }, [userId]);
}
