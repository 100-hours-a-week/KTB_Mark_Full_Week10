import { useState } from "react";
import "./CommentForm.css";

function CommentForm({ variant = "top", onSubmit }) {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit() {
    if (!value.trim() || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    Promise.resolve(onSubmit(value))
      .then(() => {
        setValue("");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  if (variant === "reply") {
    return (
      <div className="reply-input">
        <input
          type="text"
          placeholder="답글을 입력하세요"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button className="btn-reply-submit" onClick={handleSubmit} disabled={isSubmitting}>
          등록
        </button>
      </div>
    );
  }

  return (
    <div className="comment-input-wrap">
      <textarea
        className="comment-textarea"
        placeholder="댓글을 남겨주세요!"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      ></textarea>
      <div className="comment-submit-row">
        <button className="btn-comment-submit" onClick={handleSubmit} disabled={isSubmitting}>
          댓글 등록
        </button>
      </div>
    </div>
  );
}

export default CommentForm;
