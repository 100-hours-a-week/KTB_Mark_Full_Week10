import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useFileUrl } from "../../hooks/useFileUrl.js";

function ProfileMenu({ open, onToggle }) {
  const navigate = useNavigate();
  const { profileFileId, setProfileFileId, clearAuth } = useAuth();
  const { url, error } = useFileUrl(profileFileId);

  useEffect(() => {
    if (error) {
      setProfileFileId(null);
    }
  }, [error, setProfileFileId]);

  return (
    <>
      <button className="header-profile-btn" onClick={onToggle}>
        {url && <img src={url} alt="" className="header-profile-img" style={{ display: "block" }} />}
      </button>
      <div className={`profile-dropdown${open ? " show" : ""}`}>
        <button className="dropdown-item" onClick={() => navigate("/profile/edit", { replace: true })}>
          회원정보수정
        </button>
        <button className="dropdown-item" onClick={() => navigate("/password/edit", { replace: true })}>
          비밀번호수정
        </button>
        <button
          className="dropdown-item"
          onClick={() => {
            clearAuth();
            navigate("/login", { replace: true });
          }}
        >
          로그아웃
        </button>
      </div>
    </>
  );
}

export default ProfileMenu;
