export const POST_CATEGORIES = ["질문", "토론", "정보공유", "스터디모집", "공지"];

const FILTER_CATEGORIES = [
  { label: "전체" },
  { label: "질문" },
  { label: "토론" },
  { label: "정보공유" },
  { label: "스터디모집" },
  { label: "공지", muted: true },
];

function CategoryChips({ categories = FILTER_CATEGORIES, selected, onSelect }) {
  return (
    <div className="categories" role="group" aria-label="카테고리 필터">
      {categories.map((category) => (
        <button
          key={category.label}
          type="button"
          className={`cat-pill${category.muted ? " cat-pill-muted" : ""}`}
          aria-pressed={selected === category.label}
          onClick={() => onSelect(category.label)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}

export default CategoryChips;
