import { useCallback, useState } from "react";
import ProfileMenu from "./ProfileMenu.jsx";
import NotifMenu from "./NotifMenu.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import "./Header.css";

function Header({ back = false, onBack, auth = true, title = "CodeLounge" }) {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleNotif = useCallback(() => {
    setOpenMenu((prev) => (prev === "notif" ? null : "notif"));
  }, []);

  const toggleProfile = useCallback(() => {
    setOpenMenu((prev) => (prev === "profile" ? null : "profile"));
  }, []);

  const closeNotif = useCallback(() => {
    setOpenMenu((prev) => (prev === "notif" ? null : prev));
  }, []);

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          {back && (
            <button className="back-btn" onClick={onBack} aria-label="뒤로가기">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <span className="header-logo">
            <span className="header-logo-bracket">&lt;</span>
            {title}
            <span className="header-logo-bracket">/&gt;</span>
          </span>
        </div>
        <div className="header-right">
          <ThemeToggle />
          {auth && (
            <>
              <span className="header-divider" aria-hidden="true" />
              <NotifMenu open={openMenu === "notif"} onToggle={toggleNotif} onOutsideClose={closeNotif} />
              <span className="header-divider" aria-hidden="true" />
              <ProfileMenu open={openMenu === "profile"} onToggle={toggleProfile} />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
