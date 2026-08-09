import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import FormField from "../components/common/FormField.jsx";
import DefaultAvatar from "../components/common/DefaultAvatar.jsx";
import {
  useFieldValidation,
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateNickname,
  validateProfileImage,
} from "../hooks/useFieldValidation.js";
import { signup } from "../api/users.js";
import "./SignupPage.css";

function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors, validate, setFieldError, isValid } = useFieldValidation({
    profileImage: validateProfileImage,
    email: validateEmail,
    password: validatePassword,
    passwordConfirm: validatePasswordConfirm,
    nickname: validateNickname,
  });

  function handleProfileImageChange(event) {
    const file = event.target.files[0];
    setProfileImage(file ?? null);
    validate("profileImage", file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setPreviewUrl(loadEvent.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl("");
    }
  }

  function handleSubmit() {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    signup({ email, password, nickname, profileImage })
      .then(() => {
        navigate("/login", { replace: true });
      })
      .catch((error) => {
        if (error.message === "중복된 이메일 입니다.") {
          setFieldError("email", "*" + error.message);
        } else if (error.message === "중복된 닉네임 입니다.") {
          setFieldError("nickname", "*" + error.message);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <>
      <Header back auth={false} title="CodeLounge" onBack={() => navigate("/login", { replace: true })} />
      <main className="main">
        <h1 className="page-title">회원가입</h1>

        <div className="card auth-card">
          <div className="profile-wrap">
            <label htmlFor="profileUpload">
              <div className="profile-circle">
                {previewUrl ? <img src={previewUrl} alt="" /> : <DefaultAvatar />}
                {!previewUrl && <span className="profile-photo-label">사진 추가</span>}
              </div>
            </label>
            <input
              type="file"
              id="profileUpload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleProfileImageChange}
            />
            {errors.profileImage && <div className="profile-helper">{errors.profileImage}</div>}
          </div>

          <FormField
            label="이메일"
            required
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={(event) => validate("email", event.target.value)}
            helperText={errors.email}
          />
          <FormField
            label="비밀번호"
            required
            type="password"
            placeholder="비밀번호를 입력하세요"
            minLength={8}
            maxLength={20}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={(event) => validate("password", event.target.value)}
            helperText={errors.password}
          />
          <FormField
            label="비밀번호 확인"
            required
            type="password"
            placeholder="비밀번호를 한번 더 입력하세요"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            onBlur={(event) => validate("passwordConfirm", event.target.value, password)}
            helperText={errors.passwordConfirm}
          />
          <FormField
            label="닉네임"
            required
            type="text"
            placeholder="닉네임을 입력하세요"
            maxLength={10}
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            onBlur={(event) => validate("nickname", event.target.value)}
            helperText={errors.nickname}
          />
          <button className="btn-primary" disabled={!isValid || isSubmitting} onClick={handleSubmit}>
            회원가입
          </button>
        </div>

        <button className="btn-text signup-link" onClick={() => navigate("/login", { replace: true })}>
          로그인하러 가기
        </button>
      </main>
    </>
  );
}

export default SignupPage;
