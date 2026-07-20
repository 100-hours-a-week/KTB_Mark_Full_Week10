function ConfirmModal({ open, title, description, onConfirm, onCancel }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay show">
      <div className="modal-box">
        <div className="modal-title">{title}</div>
        <div className="modal-desc">{description}</div>
        <div className="modal-btns">
          <button className="btn-modal-cancel" onClick={onCancel}>
            취소
          </button>
          <button className="btn-modal-confirm" onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
