import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import ConfirmModal from "../components/common/ConfirmModal.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useFileUrl } from "../hooks/useFileUrl.js";
import { useFieldValidation, validateNickname } from "../hooks/useFieldValidation.js";
import { deleteUser, getUser, updateUser } from "../api/users.js";
import "./ProfileEditPage.css";

function ProfileEditPage() {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const { errors, validate, setFieldError } = useFieldValidation({ nickname: validateNickname });
  const [existingProfileFileId, setExistingProfileFileId] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [previewDataUrl, setPreviewDataUrl] = useState("");
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const { url: existingImageUrl } = useFileUrl(existingProfileFileId);

  useEffect(() => {
    getUser().then((result) => {
      setEmail(result.data.email);
      setNickname(result.data.nickname);
      if (result.data.profileFileId) {
        setExistingProfileFileId(result.data.profileFileId);
      }
    });
  }, []);

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    setNewImage(file);
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setPreviewDataUrl(loadEvent.target.result);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    if (!validate("nickname", nickname) || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    updateUser({ nickname, image: newImage })
      .then(() => {
        navigate("/posts", { replace: true });
      })
      .catch((error) => {
        if (error.message === "중복된 닉네임 입니다.") {
          setFieldError("nickname", "*" + error.message);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleWithdraw() {
    deleteUser().then(() => {
      clearAuth();
      navigate("/login", { replace: true });
    });
  }

  const previewSrc = previewDataUrl || existingImageUrl;

  return (
    <>
      <Header back={false} auth title="CodeLounge" />
      <main className="main">
        <div className="profile-edit-wrap">
          <h1 className="page-title">회원정보수정</h1>

          <div className="profile-section">
            <div className="field-label">
              프로필 사진<span className="required">*</span>
            </div>
            <div className="profile-img-wrap">
              <div className="profile-circle-edit" onClick={() => fileInputRef.current.click()}>
                {previewSrc && <img src={previewSrc} alt="" />}
                <span className="profile-change-label">변경</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="field" style={{ width: "100%" }}>
            <div className="field-label">이메일</div>
            <div className="field-readonly">{email}</div>

            <div className="field-label" style={{ marginTop: "10px" }}>
              닉네임
            </div>
            <input
              type="text"
              placeholder="닉네임을 입력해주세요."
              maxLength={10}
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              onBlur={(event) => validate("nickname", event.target.value)}
            />
            <div className="helper-text">{errors.nickname}</div>
          </div>

          <button className="btn-submit" onClick={handleSubmit} disabled={isSubmitting}>
            수정하기
          </button>

          <button className="btn-withdraw" onClick={() => setWithdrawModalOpen(true)}>
            회원 탈퇴
          </button>
        </div>
      </main>

      <ConfirmModal
        open={withdrawModalOpen}
        title="회원탈퇴 하시겠습니까?"
        description="작성된 게시글과 댓글은 삭제됩니다."
        onCancel={() => setWithdrawModalOpen(false)}
        onConfirm={handleWithdraw}
      />
    </>
  );
}

export default ProfileEditPage;
