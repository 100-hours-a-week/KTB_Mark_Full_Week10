function DefaultAvatar({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <circle cx="20" cy="20" r="20" fill="var(--surface-sub)" />
      <circle cx="11" cy="9" r="3.6" fill="var(--surface-sub)" stroke="var(--border)" />
      <circle cx="29" cy="9" r="3.6" fill="var(--surface-sub)" stroke="var(--border)" />
      <circle cx="20" cy="23" r="11" fill="var(--surface-sub)" stroke="var(--border)" />
      <circle cx="15.5" cy="21.5" r="1.6" fill="var(--text-secondary)" />
      <circle cx="24.5" cy="21.5" r="1.6" fill="var(--text-secondary)" />
      <path
        d="M16.5 26.5c1.4 1.5 5.6 1.5 7 0"
        stroke="var(--text-secondary)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default DefaultAvatar;
