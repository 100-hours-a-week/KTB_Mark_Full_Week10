import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import FormField from "../components/common/FormField.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useFieldValidation, validateEmail, validatePassword } from "../hooks/useFieldValidation.js";
import { login, csrf } from "../api/auth.js";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const { setUserId, setUserRole, setProfileFileId } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors, validate, isValid } = useFieldValidation({
    email: validateEmail,
    password: validatePassword,
  });

  useEffect(() => {
    csrf();
  }, []);

  function handleSubmit() {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    login(email, password)
      .then((result) => {
        if (result.data.profileFileId != null) {
          setProfileFileId(result.data.profileFileId);
        }
        setUserId(result.data.userId);
        setUserRole(result.data.userRole);
        navigate("/posts", { replace: true });
      })
      .catch(() => {
        setLoginError("*아이디 또는 비밀번호를 확인해주세요");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <>
      <Header back={false} auth={false} title="CodeLounge" />
      <main className="main login-page">
        <h1 className="page-title">로그인</h1>

        <div className="card auth-card">
          <FormField
            label="이메일"
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={(event) => validate("email", event.target.value)}
            helperText={errors.email}
          />
          <FormField
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력하세요"
            minLength={8}
            maxLength={20}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={(event) => validate("password", event.target.value)}
            helperText={errors.password}
          />
          {loginError && <div className="helper-text">{loginError}</div>}
          <button className="btn-primary" disabled={!isValid || isSubmitting} onClick={handleSubmit}>
            로그인
          </button>
        </div>

        <button className="btn-text signup-link" onClick={() => navigate("/signup")}>
          회원가입
        </button>
      </main>
    </>
  );
}

export default LoginPage;
