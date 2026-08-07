import { useNavigate } from "react-router-dom";
import { useFileUrl } from "../../hooks/useFileUrl.js";

function PostCard({ post }) {
  const navigate = useNavigate();
  const { url } = useFileUrl(post.thumbnailId);

  return (
    <div className="post-card" onClick={() => navigate(`/posts/${post.postId}`)}>
      <div className="post-card-top">
        <div className="post-title-row">
          {post.category && <span className="post-category-badge">{post.category}</span>}
          <span className="post-title">{post.title}</span>
        </div>
      </div>
      <div className="post-meta">
        <div className="post-stats">
          <span>좋아요 {post.counts.likes}</span>
          <span>댓글 {post.counts.comments}</span>
          <span>조회수 {post.counts.views}</span>
        </div>
        <span className="post-date">{post.postTime}</span>
      </div>
      <div className="post-divider"></div>
      <div className="post-author">
        <div className="author-avatar">{url && <img src={url} alt="" />}</div>
        <span className="author-name">{post.nickname}</span>
      </div>
    </div>
  );
}

export default PostCard;
