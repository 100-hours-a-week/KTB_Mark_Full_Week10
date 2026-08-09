import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import FormField from "../components/common/FormField.jsx";
import {
  useFieldValidation,
  validatePassword,
  validatePasswordConfirm,
} from "../hooks/useFieldValidation.js";
import { updatePassword } from "../api/users.js";
import "./PasswordEditPage.css";

function PasswordEditPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors, validate } = useFieldValidation({
    password: validatePassword,
    passwordConfirm: validatePasswordConfirm,
  });

  function handleSubmit() {
    if (isSubmitting) {
      return;
    }
    if (!validate("password", password)) {
      return;
    }
    if (!validate("passwordConfirm", passwordConfirm, password)) {
      return;
    }

    setIsSubmitting(true);
    updatePassword(password)
      .then(() => {
        navigate("/posts", { replace: true });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <>
      <Header back={false} auth title="CodeLounge" />
      <main className="main password-page">
        <h1 className="page-title">비밀번호 수정</h1>

        <div className="card auth-card">
          <FormField
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={(event) => validate("password", event.target.value)}
            helperText={errors.password}
          />
          <FormField
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 한번 더 입력하세요"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            onBlur={(event) => validate("passwordConfirm", event.target.value, password)}
            helperText={errors.passwordConfirm}
          />
          <button className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            수정하기
          </button>
        </div>
      </main>
    </>
  );
}

export default PasswordEditPage;
