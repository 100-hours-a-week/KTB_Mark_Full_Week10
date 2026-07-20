import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import CategoryChips from "../components/post/CategoryChips.jsx";
import PostCard from "../components/post/PostCard.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll.js";
import { listPosts } from "../api/posts.js";
import "./PostListPage.css";

function PostListPage() {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const { posts, isEmpty } = useInfiniteScroll(listPosts);
  const canWrite = userRole === "ROLE_AUTH_USER";

  return (
    <>
      <Header back={false} auth title="CodeLounge" />
      <main className="main">
        <div className="list-header">
          <p className="list-greeting">안녕하세요, CodeLounge 게시판 입니다.</p>

          <CategoryChips>
            <div className="list-toolbar">
              <CategoryChips.Toggle />
              <button
                className="write-btn"
                disabled={!canWrite}
                onClick={() => navigate("/posts/write")}
              >
                게시글 작성
              </button>
            </div>
            <CategoryChips.Panel />
          </CategoryChips>
        </div>

        <div className="post-list">
          {posts.map((post) => (
            <PostCard key={post.postId} post={post} />
          ))}
        </div>

        {isEmpty && <div className="empty-message">아직 게시글이 없어요. 첫 글을 작성해보세요!</div>}
      </main>
    </>
  );
}

export default PostListPage;
