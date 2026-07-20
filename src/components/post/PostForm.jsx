import { useRef } from "react";
import "./PostForm.css";

function PostForm({
  title,
  onTitleChange,
  body,
  onBodyChange,
  imageFileName,
  onImagesChange,
  onSubmit,
  submitLabel,
  submitDisabled = false,
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="write-form">
      <div className="field">
        <div className="field-label">
          제목<span className="required">*</span>
        </div>
        <input
          type="text"
          placeholder="제목을 입력해주세요. (최대 26글자)"
          maxLength={26}
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
        />
        <div className="helper-text"></div>
      </div>

      <div className="field">
        <div className="field-label">
          내용<span className="required">*</span>
        </div>
        <textarea
          className="content-textarea"
          placeholder="내용을 입력해주세요."
          value={body}
          onChange={(event) => onBodyChange(event.target.value)}
        ></textarea>
        <div className="helper-text"></div>
      </div>

      <div className="field">
        <div className="field-label">이미지</div>
        <div className="image-upload-row">
          <button className="image-upload-btn" onClick={() => fileInputRef.current.click()}>
            파일 선택
          </button>
          <span className="image-upload-placeholder">{imageFileName}</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(event) => onImagesChange(event.target.files)}
        />
      </div>

      <div className="submit-wrap">
        <button
          className="btn-submit"
          onClick={onSubmit}
          disabled={!title.trim() || !body.trim() || submitDisabled}
        >
          {submitLabel}
        </button>
      </div>
      <div className="helper-text">*제목, 내용을 모두 작성해주세요</div>
    </div>
  );
}

export default PostForm;
