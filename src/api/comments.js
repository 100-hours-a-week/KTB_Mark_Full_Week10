import { del, get, patch, post } from "./client.js";

export function listComments(postId) {
  return get(`posts/${postId}/comments`);
}

export function createComment(postId, comment, parentCommentId) {
  const body = parentCommentId != null ? { comment, parentCommentId } : { comment };
  return post(`posts/${postId}/comments`, body, {
    "Content-Type": "application/json",
    "Idempotency-Key": crypto.randomUUID(),
  });
}

export function updateComment(commentId, comment) {
  return patch(`comments/${commentId}`, { comment }, { "Content-Type": "application/json" });
}

export function deleteComment(commentId) {
  return del(`comments/${commentId}`);
}
