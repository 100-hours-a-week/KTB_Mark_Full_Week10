import { del, get, patch, post, put } from "./client.js";
import { generateUUID } from "./utils.js";

function buildPostFormData(title, body, images, category) {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify({ title, body, category })], { type: "application/json" }),
  );
  if (images) {
    for (const file of images) {
      formData.append("images", file);
    }
  }
  return formData;
}

export function listPosts(lastPostId, category) {
  const params = new URLSearchParams();
  if (lastPostId) {
    params.set("lastPostId", lastPostId);
  }
  if (category) {
    params.set("category", category);
  }
  const query = params.toString();
  return get(query ? `posts?${query}` : "posts");
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
    { "Content-Type": "application/json", "Idempotency-Key": generateUUID() },
  );
}

export function getTempPost(tempPostId) {
  return get(`posts/temp?postId=${tempPostId}`);
}

export function autoSaveTempPost(tempPostId, title, body, category) {
  return patch(`posts/${tempPostId}/temp`, buildPostFormData(title, body, undefined, category), {
    "Idempotency-Key": generateUUID(),
  });
}

export function submitNewPost(tempPostId, title, body, images, category) {
  return put(`posts/${tempPostId}`, buildPostFormData(title, body, images, category));
}

export function updatePost(postId, title, body, images, category) {
  return patch(`posts/${postId}`, buildPostFormData(title, body, images, category));
}
