import { useNavigate } from "react-router-dom";
import { useFileUrl } from "../../hooks/useFileUrl.js";
import DefaultAvatar from "../common/DefaultAvatar.jsx";

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s-6.7-4.35-9.3-8.1C.8 10.1 1.6 6.6 4.6 5.2c2.2-1 4.6-.3 5.9 1.5l1.5 2 1.5-2c1.3-1.8 3.7-2.5 5.9-1.5 3 1.4 3.8 4.9 1.9 7.7C18.7 16.65 12 21 12 21Z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 9 9 0 0 1-3.6-.7L3 20l1-4.7A8.4 8.4 0 0 1 12.6 3a8.4 8.4 0 0 1 8.4 8.5Z" />
    </svg>
  );
}

function PostCard({ post }) {
  const navigate = useNavigate();
  const { url } = useFileUrl(post.thumbnailId);

  return (
    <article className="post-card" onClick={() => navigate(`/posts/${post.postId}`)}>
      <div className="post-top">
        {post.category && <span className="post-cat">{post.category}</span>}
        <span className="post-title">{post.title}</span>
      </div>
      <div className="post-bottom">
        <div className="post-author">
          <span className="author-avatar">{url ? <img src={url} alt="" /> : <DefaultAvatar />}</span>
          <span className="author-name">{post.nickname}</span>
          <span className="dot">·</span>
          <span className="post-date">{post.postTime}</span>
        </div>
        <div className="post-stats">
          <span className="stat">
            <EyeIcon />
            {post.counts.views}
          </span>
          <span className="stat">
            <HeartIcon />
            {post.counts.likes}
          </span>
          <span className="stat">
            <CommentIcon />
            {post.counts.comments}
          </span>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
