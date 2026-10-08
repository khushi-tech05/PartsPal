function Logo({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <rect x="26" y="8" width="4" height="9" fill="#22d3ee" />
      <circle cx="28" cy="7" r="4" fill="#f59e0b" />
      <rect x="10" y="16" width="36" height="30" rx="8" fill="#22d3ee" />
      <circle cx="20" cy="30" r="5" fill="#0b1220" />
      <circle cx="36" cy="30" r="5" fill="#0b1220" />
      <rect x="21" y="39" width="14" height="3" rx="1.5" fill="#0b1220" />
      <rect x="3" y="26" width="5" height="10" rx="2" fill="#8b5cf6" />
      <rect x="48" y="26" width="5" height="10" rx="2" fill="#8b5cf6" />
    </svg>
  );
}

export default Logo;