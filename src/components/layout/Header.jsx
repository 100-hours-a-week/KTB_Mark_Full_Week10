import { useCallback, useState } from "react";
import ProfileMenu from "./ProfileMenu.jsx";
import NotifMenu from "./NotifMenu.jsx";
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
        {back && (
          <button className="back-btn" onClick={onBack}>
            &#10094;
          </button>
        )}
        <span className="header-title">{title}</span>
        {auth && (
          <>
            <NotifMenu open={openMenu === "notif"} onToggle={toggleNotif} onOutsideClose={closeNotif} />
            <ProfileMenu open={openMenu === "profile"} onToggle={toggleProfile} />
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
