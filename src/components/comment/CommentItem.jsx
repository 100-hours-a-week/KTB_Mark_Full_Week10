import { useState } from "react";
import CommentForm from "./CommentForm.jsx";
import DefaultAvatar from "../common/DefaultAvatar.jsx";
import "./CommentItem.css";

function CommentItem({ comment, onEdit, onRequestDelete, onReply }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.comment);
  const [replyOpen, setReplyOpen] = useState(false);

  const isOwn = comment.permission && !comment.deleted;

  function startEditing() {
    setEditValue(comment.comment);
    setIsEditing(true);
  }

  function saveEdit() {
    if (!editValue.trim()) {
      return;
    }
    onEdit(comment.commentId, editValue).then(() => {
      setIsEditing(false);
    });
  }

  return (
    <div
      className="comment-item"
      style={comment.parentCommentId ? { paddingLeft: "32px" } : undefined}
    >
      <div className="comment-meta">
        <div className="comment-avatar">
          <DefaultAvatar />
        </div>
        <span className="comment-author">{comment.nickname}</span>
        {isOwn && (
          <div className="comment-actions">
            <button className="btn-comment-edit" onClick={startEditing}>
              수정
            </button>
            <button className="btn-comment-delete" onClick={() => onRequestDelete(comment.commentId)}>
              삭제
            </button>
          </div>
        )}
        {!comment.deleted && (
          <button className="btn-reply" onClick={() => setReplyOpen((prev) => !prev)}>
            답글
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="comment-edit-form">
          <input
            className="comment-edit-input"
            type="text"
            value={editValue}
            onChange={(event) => setEditValue(event.target.value)}
          />
          <button className="btn-comment-save" onClick={saveEdit}>
            저장
          </button>
          <button className="btn-comment-cancel" onClick={() => setIsEditing(false)}>
            취소
          </button>
        </div>
      ) : (
        <div className="comment-content">{comment.comment}</div>
      )}

      {replyOpen && (
        <CommentForm
          variant="reply"
          onSubmit={(text) => onReply(comment.commentId, text).then(() => setReplyOpen(false))}
        />
      )}
    </div>
  );
}

export default CommentItem;
