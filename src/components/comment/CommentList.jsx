import CommentItem from "./CommentItem.jsx";
import "./CommentList.css";

function CommentList({ comments, onEdit, onRequestDelete, onReply }) {
  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem
          key={comment.commentId}
          comment={comment}
          onEdit={onEdit}
          onRequestDelete={onRequestDelete}
          onReply={onReply}
        />
      ))}
    </div>
  );
}

export default CommentList;
