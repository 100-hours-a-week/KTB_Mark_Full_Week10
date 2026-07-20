import { get, post } from "./client.js";

export async function csrf() {
  await cookieStore.delete("XSRF-TOKEN");
  await get("csrf");
}

export function login(email, password) {
  return post("login", { email, password }, { "Content-Type": "application/json" });
}
