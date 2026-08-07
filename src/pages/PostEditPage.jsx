import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import PostForm from "../components/post/PostForm.jsx";
import { getPost, updatePost } from "../api/posts.js";

function PostEditPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imageFileName, setImageFileName] = useState("기존 파일 명");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getPost(postId).then((result) => {
      if (cancelled) {
        return;
      }
      setTitle(result.data.title);
      setBody(result.data.body);
      setCategory(result.data.category || "");
    });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  function handleImagesChange(files) {
    setImages(files);
    let fileNames = "";
    for (const file of files) {
      fileNames += file.name + ", ";
    }
    setImageFileName(fileNames.length > 0 ? fileNames.slice(0, -2) : "기존 파일 명");
  }

  function handleSubmit() {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    updatePost(postId, title, body, images, category)
      .then(() => {
        navigate(`/posts/${postId}`, { replace: true });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <>
      <Header
        back
        auth
        title="CodeLounge"
        onBack={() => navigate(`/posts/${postId}`, { replace: true })}
      />
      <main className="main">
        <h1 className="page-title">게시글 수정</h1>
        <PostForm
          title={title}
          onTitleChange={setTitle}
          body={body}
          onBodyChange={setBody}
          category={category}
          onCategoryChange={setCategory}
          imageFileName={imageFileName}
          onImagesChange={handleImagesChange}
          onSubmit={handleSubmit}
          submitLabel="수정하기"
          submitDisabled={isSubmitting}
        />
      </main>
    </>
  );
}

export default PostEditPage;
