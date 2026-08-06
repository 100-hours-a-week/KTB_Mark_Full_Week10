import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications.js";
import ConfirmModal from "../common/ConfirmModal.jsx";

function NotifMenu({ open, onToggle, onOutsideClose }) {
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotifications();
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);

  function handleNotificationClick(notification) {
    markAsRead(notification.notificationId);
    onOutsideClose();
    navigate(`/posts/${notification.postId}`);
  }

  function handleDeleteClick(event, notificationId) {
    event.stopPropagation();
    setDeleteTargetId(notificationId);
  }

  function confirmDelete() {
    deleteNotification(deleteTargetId);
    setDeleteTargetId(null);
  }

  function confirmDeleteAll() {
    deleteAllNotifications();
    setDeleteAllModalOpen(false);
  }

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleDocumentClick(event) {
      const insideBtn = btnRef.current && btnRef.current.contains(event.target);
      const insideDropdown = dropdownRef.current && dropdownRef.current.contains(event.target);
      if (!insideBtn && !insideDropdown) {
        onOutsideClose();
      }
    }

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [open, onOutsideClose]);

  return (
    <>
      <button
        ref={btnRef}
        className="header-notif-btn"
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <span className={`notif-badge${unreadCount === 0 ? " notif-badge-hidden" : ""}`}></span>
      </button>
      <div ref={dropdownRef} className={`notif-dropdown${open ? " show" : ""}`}>
        <div className="notif-dropdown-header">
          <div className="notif-dropdown-title">알림</div>
          {notifications.length > 0 && (
            <div className="notif-dropdown-actions">
              <button className="notif-action-btn" onClick={markAllAsRead}>
                전체 읽음
              </button>
              <button
                className="notif-action-btn notif-action-btn-danger"
                onClick={() => setDeleteAllModalOpen(true)}
              >
                전체 삭제
              </button>
            </div>
          )}
        </div>
        <div className="notif-list">
          {notifications.map((notification) => (
            <div
              key={notification.notificationId}
              className="notif-item"
              onClick={() => handleNotificationClick(notification)}
            >
              {!notification.read && <span className="notif-dot"></span>}
              <div className="notif-item-body">
                <div className="notif-item-main">{notification.message}</div>
                <div className="notif-item-time">{notification.createdAt}</div>
              </div>
              <button
                className="notif-item-delete"
                onClick={(event) => handleDeleteClick(event, notification.notificationId)}
                aria-label="알림 삭제"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {notifications.length === 0 && (
          <div className="notif-empty">새로운 알림이 없습니다</div>
        )}
      </div>

      <ConfirmModal
        open={deleteTargetId != null}
        title="알림을 삭제하시겠습니까?"
        description="삭제한 내용은 복구 할 수 없습니다."
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
      />

      <ConfirmModal
        open={deleteAllModalOpen}
        title="모든 알림을 삭제하시겠습니까?"
        description="삭제한 내용은 복구 할 수 없습니다."
        onCancel={() => setDeleteAllModalOpen(false)}
        onConfirm={confirmDeleteAll}
      />
    </>
  );
}

export default NotifMenu;
