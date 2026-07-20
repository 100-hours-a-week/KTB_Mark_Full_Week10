import { useEffect, useRef } from "react";

function NotifMenu({ open, onToggle, onOutsideClose }) {
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);

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
        <span className="notif-badge notif-badge-hidden"></span>
      </button>
      <div ref={dropdownRef} className={`notif-dropdown${open ? " show" : ""}`}>
        <div className="notif-dropdown-title">알림</div>
        <div className="notif-list"></div>
        <div className="notif-empty">새로운 알림이 없습니다</div>
      </div>
    </>
  );
}

export default NotifMenu;
