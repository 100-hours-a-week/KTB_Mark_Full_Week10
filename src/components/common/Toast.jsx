import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications.js";

function Toast() {
  const { toasts, dismissToast, markAsRead } = useNotifications();
  const navigate = useNavigate();

  if (toasts.length === 0) {
    return null;
  }

  function handleClick(toast) {
    markAsRead(toast.notification.notificationId);
    dismissToast(toast.id);
    navigate(`/posts/${toast.notification.postId}`);
  }

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-item" onClick={() => handleClick(toast)}>
          <div className="toast-message">{toast.notification.message}</div>
          <button
            className="toast-close"
            onClick={(event) => {
              event.stopPropagation();
              dismissToast(toast.id);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default Toast;
