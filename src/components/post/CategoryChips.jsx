import { createContext, useContext, useEffect, useRef, useState } from "react";

export const POST_CATEGORIES = ["질문", "토론", "정보공유", "스터디모집", "공지"];

const FILTER_CATEGORIES = [
  { label: "전체" },
  { label: "질문" },
  { label: "토론" },
  { label: "정보공유" },
  { label: "스터디모집" },
  { label: "공지", muted: true },
];

const CategoryChipsContext = createContext(null);

function useCategoryChipsContext() {
  const context = useContext(CategoryChipsContext);
  if (!context) {
    throw new Error("CategoryChips.Toggle/Panel은 CategoryChips 안에서만 사용할 수 있습니다.");
  }
  return context;
}

function CategoryChips({ categories = FILTER_CATEGORIES, selected, onSelect, children }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handleDocumentClick(event) {
      const insideToggle = toggleRef.current && toggleRef.current.contains(event.target);
      const insidePanel = panelRef.current && panelRef.current.contains(event.target);
      if (!insideToggle && !insidePanel) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [open]);

  const value = { open, setOpen, selected, onSelect, categories, toggleRef, panelRef };

  return <CategoryChipsContext.Provider value={value}>{children}</CategoryChipsContext.Provider>;
}

function Toggle() {
  const { open, setOpen, selected, toggleRef } = useCategoryChipsContext();

  return (
    <button
      ref={toggleRef}
      className="category-toggle"
      onClick={(event) => {
        event.stopPropagation();
        setOpen(!open);
      }}
    >
      <span>{selected}</span>
      <span className="category-toggle-arrow">▾</span>
    </button>
  );
}

function Panel() {
  const { open, selected, onSelect, setOpen, panelRef, categories } = useCategoryChipsContext();

  return (
    <div ref={panelRef} className={`category-chips${open ? " show" : ""}`}>
      {categories.map((category) => (
        <span
          key={category.label}
          className={`chip${category.muted ? " chip-muted" : ""}${
            selected === category.label ? " active" : ""
          }`}
          onClick={() => {
            onSelect(category.label);
            setOpen(false);
          }}
        >
          {category.label}
        </span>
      ))}
    </div>
  );
}

CategoryChips.Toggle = Toggle;
CategoryChips.Panel = Panel;

export default CategoryChips;
