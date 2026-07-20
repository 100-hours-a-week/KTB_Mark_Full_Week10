import { del, get, patch, post, put } from "./client.js";

function buildPostFormData(title, body, images) {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify({ title, body })], { type: "application/json" }),
  );
  if (images) {
    for (const file of images) {
      formData.append("images", file);
    }
  }
  return formData;
}

export function listPosts(lastPostId) {
  const path = lastPostId ? `posts?lastPostId=${lastPostId}` : "posts";
  return get(path);
}

export function getPost(postId) {
  return get(`posts/${postId}`);
}

export function deletePost(postId) {
  return del(`posts/${postId}`);
}

export function likePost(postId) {
  return post(`posts/${postId}/likes`, {}, { "Content-Type": "application/json" });
}

export function unlikePost(postId) {
  return del(`posts/${postId}/likes`);
}

export function reportPost(postId) {
  return post(`posts/${postId}/reports`, {}, { "Content-Type": "application/json" });
}

export function createTempPost() {
  return post(
    "posts/temp",
    {},
    { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
  );
}

export function getTempPost(tempPostId) {
  return get(`posts/temp?postId=${tempPostId}`);
}

export function autoSaveTempPost(tempPostId, title, body) {
  return patch(`posts/${tempPostId}/temp`, buildPostFormData(title, body), {
    "Idempotency-Key": crypto.randomUUID(),
  });
}

export function submitNewPost(tempPostId, title, body, images) {
  return put(`posts/${tempPostId}`, buildPostFormData(title, body, images));
}

export function updatePost(postId, title, body, images) {
  return patch(`posts/${postId}`, buildPostFormData(title, body, images));
}
