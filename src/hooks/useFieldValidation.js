import { useCallback, useState } from "react";

const EMAIL_REGEX = /^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;

export function validateEmail(value) {
  if (value.length === 0) {
    return "*이메일을 입력해주세요";
  }
  if (!EMAIL_REGEX.test(value)) {
    return "*올바른 이메일 주소 형식을 입력해주세요 (예:example@example.com)";
  }
  return "";
}

export function validatePassword(value) {
  if (value.length === 0) {
    return "*비밀번호를 입력해주세요";
  }
  if (!PASSWORD_REGEX.test(value)) {
    return "*비밀번호는 대문자, 소문자, 숫자, 특수문자 각각 1개를 포함해야합니다.";
  }
  return "";
}

export function validatePasswordConfirm(value, password) {
  if (value.length === 0) {
    return "*비밀번호를 한번 더 입력해주세요";
  }
  if (value !== password) {
    return "*비밀번호가 다릅니다";
  }
  return "";
}

export function validateNickname(value) {
  if (value.length === 0) {
    return "*닉네임을 입력해주세요";
  }
  if (value.search(/\s/) !== -1) {
    return "*띄어쓰기를 없애주세요";
  }
  return "";
}

export function validateProfileImage(file) {
  if (!file) {
    return "*프로필 사진을 추가해주세요";
  }
  return "";
}

export function useFieldValidation(validators) {
  const [errors, setErrors] = useState({});
  const [valid, setValid] = useState({});

  const validate = useCallback(
    (field, value, context) => {
      const message = validators[field](value, context) || "";
      setErrors((prev) => ({ ...prev, [field]: message }));
      setValid((prev) => ({ ...prev, [field]: message === "" }));
      return message === "";
    },
    [validators],
  );

  const setFieldError = useCallback((field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  const isValid = Object.keys(validators).every((field) => valid[field] === true);

  return { errors, validate, setFieldError, isValid };
}
