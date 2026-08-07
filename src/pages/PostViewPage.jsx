import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import ConfirmModal from "../components/common/ConfirmModal.jsx";
import CommentForm from "../components/comment/CommentForm.jsx";
import CommentList from "../components/comment/CommentList.jsx";
import { useFileUrl } from "../hooks/useFileUrl.js";
import { useComments } from "../hooks/useComments.js";
import { deletePost, getPost, likePost, reportPost, unlikePost } from "../api/posts.js";
import { fileUrl, getFiles } from "../api/files.js";
import "./PostViewPage.css";

function PostViewPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [bodyImageUrls, setBodyImageUrls] = useState([]);
  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const { url: authorImgUrl } = useFileUrl(post?.thumbnailId);
  const {
    comments,
    submitComment,
    editComment,
    requestDelete,
    cancelDelete,
    confirmDelete,
    deleteTargetId,
  } = useComments(postId);

  useEffect(() => {
    let cancelled = false;
    getPost(postId).then((result) => {
      if (cancelled) {
        return;
      }
      setPost(result.data);
      setLikeCount(result.data.counts.likes);
    });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  useEffect(() => {
    if (!post?.fileIds || post.fileIds.length === 0) {
      return undefined;
    }
    let cancelled = false;
    getFiles(post.fileIds).then((result) => {
      if (cancelled) {
        return;
      }
      setBodyImageUrls(result.data.map((file) => fileUrl(file.filePath)));
    });
    return () => {
      cancelled = true;
    };
  }, [post?.fileIds]);

  function handleLike() {
    if (isLiking) {
      return;
    }
    setIsLiking(true);
    likePost(postId)
      .then((result) => {
        setLikeCount(result.data.likeCount);
      })
      .catch((error) => {
        if (error.status !== 409) {
          return;
        }
        return unlikePost(postId).then((result) => {
          setLikeCount(result.data.likeCount);
        });
      })
      .finally(() => {
        setIsLiking(false);
      });
  }

  function handleDeletePost() {
    deletePost(postId).then(() => {
      navigate("/posts", { replace: true });
    });
  }

  function handleReport() {
    reportPost(postId).then(() => {
      setReportModalOpen(false);
    });
  }

  return (
    <>
      <Header back auth title="CodeLounge" onBack={() => navigate("/posts", { replace: true })} />
      <main className="main">
        {post && (
          <div className="view-wrap">
            <div className="post-view-title-row">
              {post.category && <span className="post-category-badge">{post.category}</span>}
              <div className="post-view-title">{post.title}</div>
            </div>

            <div className="post-view-meta">
              <div className="meta-avatar">{authorImgUrl && <img src={authorImgUrl} alt="" />}</div>
              <span className="meta-author">{post.nickname}</span>
              <span className="meta-date">{post.postTime}</span>
              {post.permission && (
                <div className="meta-actions">
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/posts/${postId}/edit`, { replace: true })}
                  >
                    수정
                  </button>
                  <button className="btn-delete" onClick={() => setDeletePostModalOpen(true)}>
                    삭제
                  </button>
                </div>
              )}
              <button className="btn-report" onClick={() => setReportModalOpen(true)}>
                신고
              </button>
            </div>

            <div className="view-divider"></div>

            {bodyImageUrls.length > 0 && (
              <div className="post-view-image" style={{ display: "block" }}>
                {bodyImageUrls.map((src) => (
                  <img key={src} src={src} alt="" />
                ))}
              </div>
            )}

            <div className="post-view-content">{post.body}</div>

            <div className="post-view-stats">
              <div className="stat-box" onClick={handleLike}>
                <span className="stat-value">{likeCount}</span>
                <span className="stat-label">좋아요</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{post.counts.views}</span>
                <span className="stat-label">조회수</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{comments.length}</span>
                <span className="stat-label">댓글</span>
              </div>
            </div>

            <CommentForm variant="top" onSubmit={(text) => submitComment(text)} />

            <CommentList
              comments={comments}
              onEdit={editComment}
              onRequestDelete={requestDelete}
              onReply={(parentCommentId, text) => submitComment(text, parentCommentId)}
            />
          </div>
        )}
      </main>

      <ConfirmModal
        open={deletePostModalOpen}
        title="게시글을 삭제하시겠습니까?"
        description="삭제한 내용은 복구 할 수 없습니다."
        onCancel={() => setDeletePostModalOpen(false)}
        onConfirm={handleDeletePost}
      />

      <ConfirmModal
        open={deleteTargetId != null}
        title="댓글을 삭제하시겠습니까?"
        description="삭제한 내용은 복구 할 수 없습니다."
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />

      <ConfirmModal
        open={reportModalOpen}
        title="게시글을 신고하시겠습니까?"
        description="신고된 게시글은 검토 후 처리됩니다."
        onCancel={() => setReportModalOpen(false)}
        onConfirm={handleReport}
      />
    </>
  );
}

export default PostViewPage;
