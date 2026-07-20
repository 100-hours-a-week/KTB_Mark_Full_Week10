import { del, get, patch, post } from "./client.js";

export function signup({ email, password, nickname, profileImage }) {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify({ email, password, nickname })], { type: "application/json" }),
  );
  if (profileImage) {
    formData.append("profileImage", profileImage);
  }
  return post("users", formData);
}

export function getUser() {
  return get("users");
}

export function updateUser({ nickname, image }) {
  const formData = new FormData();
  formData.append("request", new Blob([JSON.stringify({ nickname })], { type: "application/json" }));
  if (image) {
    formData.append("image", image);
  }
  return patch("users", formData);
}

export function updatePassword(password) {
  const formData = new FormData();
  formData.append("request", new Blob([JSON.stringify({ password })], { type: "application/json" }));
  return patch("users", formData);
}

export function deleteUser() {
  return del("users");
}
