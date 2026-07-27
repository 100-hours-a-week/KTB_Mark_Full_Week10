import { get, post } from "./client.js";

export async function csrf() {
  document.cookie = "XSRF-TOKEN=; max-age=0; path=/;";
  await get("csrf");
}

export function login(email, password) {
  return post("login", { email, password }, { "Content-Type": "application/json" });
}
