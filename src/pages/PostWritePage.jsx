import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import ConfirmModal from "../components/common/ConfirmModal.jsx";
import PostForm from "../components/post/PostForm.jsx";
import { useTempPost } from "../hooks/useTempPost.js";
import { submitNewPost } from "../api/posts.js";

function PostWritePage() {
  const navigate = useNavigate();
  const {
    tempPostId,
    title,
    setTitle,
    body,
    setBody,
    needsResumeChoice,
    resume,
    startFresh,
    stopAutoSave,
    clearTempPost,
  } = useTempPost();
  const [images, setImages] = useState([]);
  const [imageFileName, setImageFileName] = useState("파일을 선택해주세요.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleImagesChange(files) {
    setImages(files);
    let fileNames = "";
    for (const file of files) {
      fileNames += file.name + ", ";
    }
    setImageFileName(fileNames.length !== 0 ? fileNames : "파일을 선택해주세요.");
  }

  function handleSubmit() {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    submitNewPost(tempPostId, title, body, images)
      .then((result) => {
        stopAutoSave();
        clearTempPost();
        navigate(`/posts/${result.data.postId}`, { replace: true });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <>
      <Header back auth title="CodeLounge" onBack={() => navigate("/posts", { replace: true })} />
      <main className="main">
        <h1 className="page-title">게시글 작성</h1>
        <PostForm
          title={title}
          onTitleChange={setTitle}
          body={body}
          onBodyChange={setBody}
          imageFileName={imageFileName}
          onImagesChange={handleImagesChange}
          onSubmit={handleSubmit}
          submitLabel="완료"
          submitDisabled={isSubmitting}
        />
      </main>

      <ConfirmModal
        open={needsResumeChoice}
        title="이전에 작성 중인 글이 있습니다."
        description="이어서 작성할까요?"
        onCancel={startFresh}
        onConfirm={resume}
      />
    </>
  );
}

export default PostWritePage;
